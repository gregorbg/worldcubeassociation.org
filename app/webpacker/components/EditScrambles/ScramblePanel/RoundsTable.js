import React from 'react';

import { Segment, Table } from 'semantic-ui-react';

import RoundRow from './RoundRow';

export default function RoundsTable({ wcifEvent, disabled }) {
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
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell disabled collapsing>Format</Table.HeaderCell>
            <Table.HeaderCell disabled collapsing style={{ width: '5em' }}>Scramble Sets</Table.HeaderCell>
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
