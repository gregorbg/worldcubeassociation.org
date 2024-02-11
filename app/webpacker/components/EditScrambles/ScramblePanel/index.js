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
  Label,
  Progress,
  Segment,
} from 'semantic-ui-react';
import cn from 'classnames';
import { randomScrambleForEvent } from 'cubing/scramble';
import { events } from '../../../lib/wca-data.js.erb';
import RoundsTable from './RoundsTable';
import { useDispatch, useStore } from '../../../lib/providers/StoreProvider';
import ScrambleView from './ScrambleView';
import {
  addScrambleSet,
  resetScrambles as resetWcifScrambles,
  setCurrentlyScrambling,
} from '../store/actions';
import { getExtraScrambleCount, isEventFullyScrambled } from '../utils';

export default function ScramblePanel({
  wcifEvent,
}) {
  const {
    currentlyScrambling: {
      [wcifEvent.id]: isScrambling,
    },
  } = useStore();

  const dispatch = useDispatch();

  const [isScramblingLocked, setIsScramblingLocked] = useState(false);
  const [areScramblesComputing, setAreScramblesComputing] = useState(false);

  const wcaEvent = useMemo(() => events.byId[wcifEvent.id], [wcifEvent.id]);

  const setIsScrambling = useCallback((scrambling = true) => {
    dispatch(setCurrentlyScrambling(wcifEvent.id, scrambling));
  }, [dispatch, wcifEvent.id]);

  const resetScrambles = useCallback(() => {
    setIsScrambling(false);

    dispatch(resetWcifScrambles(wcifEvent.id));
    setIsScramblingLocked(false);
  }, [dispatch, wcifEvent.id, setIsScrambling]);

  const generateScrambles = useCallback(() => {
    setAreScramblesComputing(true);

    const roundPromises = wcifEvent.rounds.map((round) => {
      const missingScrambleSets = round.scrambleSetCount - round.scrambleSets.length;

      const scrambleSetPromises = Array(missingScrambleSets).fill(true).map((_) => {
        const expectedScrambleStr = round.format.replace('m', '3').replace('a', '5');
        const expectedScrambleCount = Number(expectedScrambleStr);

        const extraScrambleCount = getExtraScrambleCount(round);

        const totalScrambleCount = expectedScrambleCount + extraScrambleCount;

        const scrambleStringPromises = Array(totalScrambleCount).fill(true).map((_) => {
          const scrEventId = wcaEvent.id.replace('333mbf', '333bf');

          return randomScrambleForEvent(scrEventId).then((cubingScr) => cubingScr.toString());
        });

        return Promise.all(scrambleStringPromises).then((scrambles) => {
          dispatch(addScrambleSet(round.id, {
            scrambles: scrambles.slice(0, expectedScrambleCount),
            extraScrambles: scrambles.slice(-extraScrambleCount),
          }));
        });
      });

      return Promise.all(scrambleSetPromises);
    });

    return Promise.all(roundPromises)
      .finally(() => setAreScramblesComputing(false));
  }, [dispatch, wcifEvent.rounds, wcaEvent.id]);

  useEffect(() => {
    if (isScrambling && !isScramblingLocked) {
      setIsScramblingLocked(true);
    }
  }, [isScrambling, isScramblingLocked]);

  useEffect(() => {
    if (isScramblingLocked && !areScramblesComputing) {
      generateScrambles()
        .finally(() => {
          setIsScramblingLocked(false);
          setIsScrambling(false);
        });
    }
  }, [isScrambling, generateScrambles, isScramblingLocked, areScramblesComputing, setIsScrambling]);

  const targetScrambleSets = wcifEvent.rounds.reduce(
    (acc, round) => (acc + round.scrambleSetCount),
    0,
  );

  const existingScrambleSets = wcifEvent.rounds.reduce(
    (acc, round) => (acc + round.scrambleSets.length),
    0,
  );

  const progressRatio = targetScrambleSets > 0 ? (existingScrambleSets / targetScrambleSets) : 0;
  const progressPercent = Math.round(progressRatio * 100);

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
            <Icon className={cn('cubing-icon', `event-${wcaEvent.id}`)} />
            {wcaEvent.name}
          </Label>
          <ScrambleView wcifEvent={wcifEvent} />
          <Label as="a" basic attached="bottom right">
            <Icon name="paint brush" />
            Edit color scheme
          </Label>
        </Segment>
      </Card.Content>
      {wcifEvent.rounds !== null && (
        <>
          <Card.Content>
            <RoundsTable wcifEvent={wcifEvent} />
          </Card.Content>
          <Card.Content>
            <Progress
              percent={progressPercent}
              indicating={isScrambling}
              autoSuccess
              style={{ marginBottom: 0 }}
            />
          </Card.Content>
          <Card.Content>
            {existingScrambleSets > 0 && (
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
