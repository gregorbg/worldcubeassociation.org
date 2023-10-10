import React, { useEffect, useRef } from 'react';

import {
  Button,
  Card,
  Icon,
  Label, Segment,
} from 'semantic-ui-react';
import cn from 'classnames';
import { randomScrambleForEvent } from "cubing/scramble";
import { eventInfo } from "cubing/puzzles";
import { TwistyPlayer } from 'cubing/twisty';
import { events } from '../../../lib/wca-data.js.erb';
import RoundsTable from './RoundsTable';
import { useStore } from '../../../lib/providers/StoreProvider';

export default function ScramblePanel({
  wcifEvent,
}) {
  const {
    wcifEvents, canAddAndRemoveEvents, canUpdateEvents, canUpdateQualifications,
  } = useStore();

  const disabled = !canUpdateEvents;
  const event = events.byId[wcifEvent.id];

  const puzzleId = eventInfo(wcifEvent.id)?.puzzleID;

  const twistyRef = useRef();

  useEffect(() => {
    if (!twistyRef.current) return;

    const eventId = event.id.replace('333mbf', '333bf');
    const scramblePromise = randomScrambleForEvent(eventId);

    twistyRef.current.alg = scramblePromise;
  }, [twistyRef, event.id]);

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
            visualization="2D"
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
              wcifEvents={wcifEvents}
              wcifEvent={wcifEvent}
              disabled={disabled}
            />
          </Card.Content>
          <Card.Content>
            <Button icon secondary labelPosition="left" floated="left">
              <Icon name="repeat" />
              Reset
            </Button>
            <Button icon positive labelPosition="left" floated="right">
              <Icon name="shuffle" />
              Generate
            </Button>
          </Card.Content>
        </>
      )}
    </Card>
  );
}
