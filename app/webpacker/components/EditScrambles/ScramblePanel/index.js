import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Card,
  Icon,
  Input,
  Label,
  Progress,
  Segment, Transition,
} from 'semantic-ui-react';
import cn from 'classnames';
import { events } from '../../../lib/wca-data.js.erb';
import RoundsTable from './RoundsTable';
import { useDispatch, useStore } from '../../../lib/providers/StoreProvider';
import ScrambleView from './ScrambleView';
import {
  resetScrambles as resetWcifScrambles,
  setMbldAttemptedCubes,
} from '../store/actions';
import {
  getExtraScrambleCount, getGeneratedScramblesCount,
  getMbldCubesCount,
  getStandardScrambleCount,
  isEventFullyScrambled, useScramblingAction,
} from '../utils';
import { activityMatchesEvent } from '../../../lib/utils/edit-schedule';
import ActivityMatcher from '../ActivityMatcher';

export default function ScramblePanel({
  wcifEvent,
}) {
  const {
    currentlyScrambling: {
      [wcifEvent.id]: isScrambling,
    },
    wcifSchedule,
  } = useStore();

  const dispatch = useDispatch();

  const wcaEvent = useMemo(() => events.byId[wcifEvent.id], [wcifEvent.id]);

  const generateScramblesAction = useScramblingAction();

  const generateScrambles = useCallback(() => {
    generateScramblesAction(wcifEvent);
  }, [generateScramblesAction, wcifEvent]);

  const resetScrambles = useCallback(() => {
    dispatch(resetWcifScrambles(wcifEvent.id));
  }, [dispatch, wcifEvent.id]);

  const mbldCubesCountChanged = useCallback((evt, data) => {
    dispatch(setMbldAttemptedCubes(data.value));
  }, [dispatch]);

  const targetScrambleCount = wcifEvent.rounds.reduce(
    (acc, round) => (
      acc + round.scrambleSetCount * (
        getStandardScrambleCount(round, wcifEvent) + getExtraScrambleCount(round)
      )
    ),
    0,
  );

  const existingScrambleCount = wcifEvent.rounds.reduce(
    (acc, round) => (
      acc + round.scrambleSets.reduce(
        (scrAcc, scrSet) => (scrAcc + getGeneratedScramblesCount(scrSet, wcifEvent.id)),
        0,
      )
    ),
    0,
  );

  const scramblesExist = existingScrambleCount > 0;

  const progressRatio = targetScrambleCount > 0 ? (existingScrambleCount / targetScrambleCount) : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const topLevelActivities = wcifSchedule.venues
    .flatMap((venue) => venue.rooms)
    .flatMap((room) => room.activities);

  const eventActivities = topLevelActivities.filter(
    (act) => activityMatchesEvent(act, wcifEvent.id),
  );

  const [showActivityPicker, setShowActivityPicker] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  return (
    <Card
      style={{ minWidth: 'min-content' }}
      size="tiny"
      className={`scramble-panel event-${wcifEvent.id}`}
    >
      <Card.Content
        // replicate the way SemUI Cards handle images (borderless) without passing an actual image
        style={{ padding: 0 }}
      >
        <Segment tertiary style={{ borderTop: 'none', textAlign: '-webkit-center' }} textAlign="center">
          <Label attached="top right" size="huge">
            <Icon className={cn('cubing-icon', `event-${wcifEvent.id}`)} />
            {wcaEvent.name}
          </Label>
          <ScrambleView wcifEvent={wcifEvent} scramblingProgress={progressRatio} />
          <Label as="a" basic attached="bottom right" onClick={() => setShowActivityPicker((show) => !show)}>
            <Icon name="calendar" />
            Show activity picker
          </Label>
        </Segment>
      </Card.Content>
      {wcifEvent.rounds !== null && (
        <>
          <Transition visible={showActivityPicker} animation="scale">
            <Card.Content>
              <ActivityMatcher activities={eventActivities} />
            </Card.Content>
          </Transition>
          <Card.Content>
            <RoundsTable wcifEvent={wcifEvent} />
          </Card.Content>
          {wcifEvent.id === '333mbf' && (
            <Card.Content>
              <Input
                name="mbldCubes"
                type="number"
                label="Number of cubes per attempt"
                min={2}
                max={120}
                value={getMbldCubesCount(wcifEvent)}
                onChange={mbldCubesCountChanged}
                disabled={scramblesExist}
              />
            </Card.Content>
          )}
          <Card.Content>
            <Progress
              percent={progressPercent}
              indicating={isScrambling}
              autoSuccess
              style={{ marginBottom: 0 }}
            />
          </Card.Content>
          <Card.Content>
            {scramblesExist && (
              <Button
                icon
                secondary
                labelPosition="left"
                floated="left"
                onClick={resetScrambles}
                disabled={isScrambling}
              >
                <Icon name="repeat" />
                Reset
              </Button>
            )}
            <Button
              icon
              positive
              labelPosition="left"
              floated="right"
              onClick={generateScrambles}
              disabled={isEventFullyScrambled(wcifEvent) || isScrambling}
            >
              <Icon name="shuffle" />
              Generate
            </Button>
            <Button
              icon
              basic
              labelPosition="left"
              floated="left"
              onClick={() => setShowDebug((debug) => !debug)}
            >
              <Icon name="bug" />
              Debug
            </Button>
          </Card.Content>
        </>
      )}
      {showDebug && (
        <Card.Content>
          <pre>
            {JSON.stringify(wcifEvent, null, 2)}
          </pre>
        </Card.Content>
      )}
    </Card>
  );
}
