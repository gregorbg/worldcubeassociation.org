import React, { useState } from 'react';

import {
  Button,
  Card,
  Icon,
  Label, Progress, Segment,
} from 'semantic-ui-react';
import cn from 'classnames';
import { randomScrambleForEvent } from "cubing/scramble";
import { events } from '../../../lib/wca-data.js.erb';
import RoundsTable from './RoundsTable';
import { useStore, useDispatch } from '../../../lib/providers/StoreProvider';
import ScrambleView from './ScrambleView';
import { addScrambleSet, resetScrambles as resetWcifScrambles } from '../store/actions';

export default function ScramblePanel({
  wcifEvent,
}) {
  const {
    canUpdateEvents,
  } = useStore();

  const dispatch = useDispatch();

  const disabled = !canUpdateEvents;
  const event = events.byId[wcifEvent.id];

  const [isScrambling, setIsScrambling] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const scrambleNow = async () => {
    setIsScrambling(true);
    setIsResetting(false);

    const scramblePromises = wcifEvent.rounds.map((round, roundNum) => {
      const roundPromises = Array(round.scrambleSetCount).fill(true).map((_, scrSetNum) => {
        const expectedScrambleStr = round.format.replace('m', '3').replace('a', '5');
        const expectedSrambleCount = Number(expectedScrambleStr);

        const scrambleSetPromises = Array(expectedSrambleCount).fill(round.format).map((_, scrNum) => {
          const scrEventId = event.id.replace('333mbf', '333bf');

          return randomScrambleForEvent(scrEventId).then((cubingScr) => {
            console.log('Generated single scramble!', wcifEvent.id, roundNum, scrSetNum, scrNum, cubingScr.toString());
            return cubingScr.toString();
          });
        });

        return Promise.all(scrambleSetPromises).then((scrSet) => {
          console.log('Generated full scramble set!', wcifEvent.id, roundNum, scrSetNum, scrSet);

          // check if somebody cancelled the scrambling in the meantime
          if (!isResetting) {
            dispatch(addScrambleSet(round.id, {
              id: scrSetNum, // TODO this can lead to duplicates
              scrambles: scrSet,
              extraScrambles: [], // TODO missing extra support
            }));
          }

          return scrSet;
        });
      });

      return Promise.all(roundPromises).then((scrambledRound) => {
        console.log('Scrambled full round!', wcifEvent.id, roundNum, scrambledRound);
        return scrambledRound;
      });
    });

    const scramblePromise = Promise.all(scramblePromises);
    const fullyScrambled = await scramblePromise;
    console.log('Done scrambling!', wcifEvent.id, fullyScrambled);

    setIsScrambling(false);
  };

  const resetScrambles = () => {
    setIsResetting(true);
    setIsScrambling(false);

    console.log('Resetting scrambles!');
    dispatch(resetWcifScrambles(wcifEvent.id));
  };

  const targetScrambles = wcifEvent.rounds.reduce((acc, round) => {
    const expectedScrambleStr = round.format.replace('m', '3').replace('a', '5');
    const expectedScrambleCount = Number(expectedScrambleStr);

    return (
      acc + expectedScrambleCount * round.scrambleSetCount
    );
  }, 0);

  const existingScrambles = wcifEvent.rounds.reduce((acc, round) => (
    acc + (round.scrambleSets?.reduce((scrAcc, scrambleSet) => (
      scrAcc + scrambleSet.scrambles.length
    ), 0) ?? 0)
  ), 0);

  const progressRatio = targetScrambles > 0 ? (existingScrambles / targetScrambles) : 0;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <Card
      style={{ minWidth: 'min-content' }}
      size="tiny"
      compact
      className={`scramble-panel event-${wcifEvent.id}`}
    >
      <Card.Content
        // replicate the way SemUI Cards handle images (borderless) without passing an actual image
        style={{ padding: 0 }}
      >
        <Segment tertiary style={{ borderTop: 'none', textAlign: '-webkit-center' }} textAlign="center">
          <Label attached="top right" size="huge">
            <Icon className={cn('cubing-icon', `event-${event.id}`)} />
            {event.name}
          </Label>
          <ScrambleView eventId={wcifEvent.id} isPlaying={isScrambling} isResetting={isResetting} />
          <Label as="a" basic attached="bottom right" onClick={(e, data) => console.log(data)}>
            <Icon name="paint brush" />
            Edit color scheme
          </Label>
        </Segment>
      </Card.Content>
      {wcifEvent.rounds !== null && (
        <>
          <Card.Content>
            <RoundsTable
              wcifEvent={wcifEvent}
              disabled={disabled}
            />
          </Card.Content>
          <Card.Content>
            <Progress percent={progressPercent} indicating autoSuccess style={{ marginBottom: 0 }} />
          </Card.Content>
          <Card.Content>
            <Button icon secondary labelPosition="left" floated="left" onClick={resetScrambles}>
              <Icon name="repeat" />
              Reset
            </Button>
            <Button icon positive labelPosition="left" floated="right" onClick={scrambleNow}>
              <Icon name="shuffle" />
              Generate
            </Button>
          </Card.Content>
        </>
      )}
    </Card>
  );
}
