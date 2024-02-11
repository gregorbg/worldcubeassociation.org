import React, { useMemo } from 'react';

import { Input, Table } from 'semantic-ui-react';
import { events, formats } from '../../../lib/wca-data.js.erb';

import { useDispatch } from '../../../lib/providers/StoreProvider';
import { useConfirm } from '../../../lib/providers/ConfirmProvider';
import {
  setExtraScrambleCount,
  setScrambleSetCount,
} from '../store/actions';
import { DEFAULT_EXTRA_SCRAMBLE_COUNT, getExtraScrambleCount } from '../utils';

export default function RoundRow({
  index, wcifRound, wcifEvent,
}) {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const event = events.byId[wcifEvent.id];

  const roundNumber = index + 1;

  const scrambleSetCountChanged = (e) => {
    dispatch(setScrambleSetCount(wcifRound.id, parseInt(e.target.value, 10)));
  };

  const extraScrambleCountChanged = (e) => {
    dispatch(setExtraScrambleCount(wcifRound.id, parseInt(e.target.value, 10)));
  };

  const wcaFormat = useMemo(() => formats.byId[wcifRound.format], [wcifRound.format]);

  return (
    <Table.Row
      verticalAlign="middle"
      name={`round-${roundNumber}`}
    >
      <Table.Cell verticalAlign="middle" collapsing>
        {wcifRound.id.split('-')[1].replace('r', '')}
      </Table.Cell>
      <Table.Cell verticalAlign="middle" collapsing>
        {wcaFormat.shortName}
      </Table.Cell>

      <Table.Cell>
        <Input
          name="scrambleSetCount"
          type="number"
          min={1}
          max={100}
          value={wcifRound.scrambleSetCount}
          onChange={scrambleSetCountChanged}
        />
      </Table.Cell>

      <Table.Cell>
        <Input
          name="extraScramblesCount"
          type="number"
          min={DEFAULT_EXTRA_SCRAMBLE_COUNT}
          max={5}
          value={getExtraScrambleCount(wcifRound)}
          onChange={extraScrambleCountChanged}
        />
      </Table.Cell>
    </Table.Row>
  );
}
