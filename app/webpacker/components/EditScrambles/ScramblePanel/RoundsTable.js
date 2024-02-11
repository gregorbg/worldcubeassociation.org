import React from 'react';

import { Segment, Table } from 'semantic-ui-react';

import RoundRow from './RoundRow';
import { useStore } from '../../../lib/providers/StoreProvider';

export default function RoundsTable({ wcifEvent }) {
  const {
    canUpdateEvents,
  } = useStore();

  const disabled = !canUpdateEvents;

  return (
    <Segment basic>
      <Table
        unstackable
        basic="very"
        textAlign="center"
        size="small"
        compact="very"
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell disabled collapsing>#</Table.HeaderCell>
            <Table.HeaderCell disabled collapsing>Format</Table.HeaderCell>
            <Table.HeaderCell>Scramble Sets</Table.HeaderCell>
            <Table.HeaderCell>Extra Scrambles</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {wcifEvent.rounds.map((wcifRound, index) => (
            <RoundRow
              key={wcifRound.id}
              index={index}
              wcifEvent={wcifEvent}
              wcifRound={wcifRound}
              disabled={disabled}
            />
          ))}
        </Table.Body>
      </Table>
    </Segment>
  );
}
