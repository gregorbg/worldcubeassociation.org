import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Card,
  Icon,
  Input,
  Label,
  List,
  Progress,
  Segment, Transition,
} from 'semantic-ui-react';
import cn from 'classnames';
import { randomScrambleForEvent } from 'cubing/scramble';
import _ from 'lodash';
import { events } from '../../../lib/wca-data.js.erb';
import RoundsTable from './RoundsTable';
import { useDispatch, useStore } from '../../../lib/providers/StoreProvider';
import ScrambleView from './ScrambleView';
import {
  addScrambleSet,
  resetScrambles as resetWcifScrambles,
  setCurrentlyScrambling, setMbldAttemptedCubes,
} from '../store/actions';
import {
  getExtraScrambleCount, getGeneratedScramblesCount,
  getMbldCubesCount,
  getStandardScrambleCount,
  isEventFullyScrambled,
} from '../utils';
import { activityMatchesEvent } from '../../../lib/utils/edit-schedule';

function NestedActivityLabels({ activities }) {
  return (
    activities.map((act) => (
      <List.Item key={act.id}>
        <Label as={act.childActivities.length === 0 && 'a'}>{act.name}</Label>
        {act.childActivities.length > 0 && (
          <List.List>
            <NestedActivityLabels activities={act.childActivities} />
          </List.List>
        )}
      </List.Item>
    ))
  );
}

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

  const [isScramblingLocked, setIsScramblingLocked] = useState(false);

  const wcaEvent = useMemo(() => events.byId[wcifEvent.id], [wcifEvent.id]);

  const setIsScrambling = useCallback((scrambling = true) => {
    dispatch(setCurrentlyScrambling(wcifEvent.id, scrambling));
  }, [dispatch, wcifEvent.id]);

  const resetScrambles = useCallback(() => {
    setIsScrambling(false);

    dispatch(resetWcifScrambles(wcifEvent.id));
    setIsScramblingLocked(false);
  }, [dispatch, wcifEvent.id, setIsScrambling]);

  const mbldCubesCountChanged = useCallback((evt, data) => {
    dispatch(setMbldAttemptedCubes(data.value));
  }, [dispatch]);

  const generateScrambles = useCallback(() => {
    const roundPromises = wcifEvent.rounds.map((round) => {
      const missingScrambleSets = round.scrambleSetCount - round.scrambleSets.length;

      const scrambleSetPromises = Array(missingScrambleSets).fill(true).map((_foo) => {
        const standardScrambleCount = getStandardScrambleCount(round, wcifEvent);
        const extraScrambleCount = getExtraScrambleCount(round);

        const totalScrambleCount = standardScrambleCount + extraScrambleCount;

        const scrambleStringPromises = Array(totalScrambleCount).fill(true).map((_bar) => {
          const scrEventId = wcifEvent.id.replace('333mbf', '333bf');

          return randomScrambleForEvent(scrEventId).then((cubingScr) => cubingScr.toString());
        });

        return Promise.all(scrambleStringPromises).then((scrambles) => {
          if (wcifEvent.id === '333mbf') {
            const baseScrambles = scrambles.slice(0, -extraScrambleCount);
            const groupedScrambles = _.chunk(baseScrambles, getMbldCubesCount(wcifEvent));

            dispatch(addScrambleSet(round.id, {
              scrambles: groupedScrambles.map((scs) => scs.join('\n')),
              extraScrambles: scrambles.slice(-extraScrambleCount),
            }));
          } else {
            dispatch(addScrambleSet(round.id, {
              scrambles: scrambles.slice(0, standardScrambleCount),
              extraScrambles: scrambles.slice(-extraScrambleCount),
            }));
          }
        });
      });

      return Promise.all(scrambleSetPromises);
    });

    return Promise.all(roundPromises);
  }, [dispatch, wcifEvent]);

  useEffect(() => {
    if (isScrambling && !isScramblingLocked) {
      setIsScramblingLocked(true);

      generateScrambles()
        .finally(() => {
          setIsScrambling(false);
          setIsScramblingLocked(false);
        });
    }
  }, [isScrambling, setIsScrambling, isScramblingLocked, setIsScramblingLocked, generateScrambles]);

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
        (scrAcc, scrSet) => (scrAcc + getGeneratedScramblesCount(scrSet, wcifEvent)),
        0,
      )
    ),
    0,
  );

  const progressRatio = targetScrambleCount > 0 ? (existingScrambleCount / targetScrambleCount) : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const rooms = wcifSchedule.venues.flatMap((venue) => venue.rooms);
  const topLevelActivities = rooms.flatMap((room) => room.activities);

  const eventActivities = topLevelActivities.filter((act) => activityMatchesEvent(act, wcifEvent.id));

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
              <Segment basic>
                <List>
                  <NestedActivityLabels activities={eventActivities} />
                </List>
              </Segment>
              <Button fluid icon primary labelPosition="left">
                <Icon name="lightbulb outline" />
                Auto-assign
              </Button>
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
                disabled={existingScrambleCount > 0}
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
            {existingScrambleCount > 0 && (
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
              onClick={() => setIsScrambling(true)}
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
