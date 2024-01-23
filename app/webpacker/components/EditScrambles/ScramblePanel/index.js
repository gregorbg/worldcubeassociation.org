import React, { useEffect, useRef } from 'react';

import {
  Button,
  Card,
  Icon,
  Label, Progress, Segment,
} from 'semantic-ui-react';
import { randomScrambleForEvent } from "cubing/scramble";
import { eventInfo } from "cubing/puzzles";
import { TwistyPlayer } from 'cubing/twisty';
import cn from 'classnames';
import { events } from '../../../lib/wca-data.js.erb';
import RoundsTable from './RoundsTable';
import { useStore, useDispatch } from '../../../lib/providers/StoreProvider';

export default function ScramblePanel({
  wcifEvent,
}) {
  const {
    wcifEvents, canUpdateEvents,
  } = useStore();

  const dispatch = useDispatch();

  const disabled = !canUpdateEvents;
  const event = events.byId[wcifEvent.id];

  const puzzleId = eventInfo(wcifEvent.id)?.puzzleID;

  const twistyRef = useRef();

  useEffect(() => {
    if (!twistyRef.current) return;

    const scrEventId = event.id.replace('333mbf', '333bf');
    const scramblePromise = randomScrambleForEvent(scrEventId);

    twistyRef.current.alg = scramblePromise;
  }, [twistyRef, event.id]);

  const scrambleNow = () => {
    wcifEvent.rounds.forEach((round) => {
      Array(round.scrambleSetCount).fill(true).forEach((i) => {
        const expectedScrambleStr = round.format.replace('m', '3').replace('a', '5');
        const expectedSrambleCount = Number(expectedScrambleStr);

        Array(expectedSrambleCount).fill(round.format).forEach(() => {
          const scrEventId = event.id.replace('333mbf', '333bf');

          randomScrambleForEvent(scrEventId).then((scrString) => {
            console.log(wcifEvent.id, i, scrString.toString());
          });
        });
      });
    });
  };

  const targetScrambles = wcifEvent.rounds.reduce((acc, round) => {
    const expectedScrambleStr = round.format.replace('m', '3').replace('a', '5');
    const expectedSrambleCount = Number(expectedScrambleStr);

    return (
      acc + expectedSrambleCount * round.scrambleSetCount
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
          <twisty-player
            class="attached"
            background="none"
            control-panel="none"
            visualization="3D"
            hint-facelets="none"
            puzzle={puzzleId}
            ref={twistyRef}
          />
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
            <Progress percent={progressPercent} indicating autoSuccess />
          </Card.Content>
          <Card.Content>
            <Button icon secondary labelPosition="left" floated="left">
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
