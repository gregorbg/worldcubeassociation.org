import React from 'react';

import {
  Dropdown, Input, Table,
} from 'semantic-ui-react';
import { events, formats } from '../../../lib/wca-data.js.erb';
import { roundIdToString } from '../../../lib/utils/wcif';

import { useDispatch } from '../../../lib/providers/StoreProvider';
import { useConfirm } from '../../../lib/providers/ConfirmProvider';
import { updateRoundFormat, setScrambleSetCount, updateCutoff } from '../store/actions';

export default function RoundRow({
  index, wcifRound, wcifEvent,
}) {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const event = events.byId[wcifEvent.id];

  const roundNumber = index + 1;

  const roundFormatChanged = (e, { value }) => {
    const newFormat = value;

    if (
      wcifRound.cutoff
      && !formats.byId[newFormat].allowedFirstPhaseFormats.includes(
        wcifRound.cutoff.numberOfAttempts.toString(),
      )
    ) {
      // if the format is changing to a format that doesn't have a cutoff
      confirm({
        content: `Are you sure you want to change the format of ${roundIdToString(wcifRound.id)}? This will clear the cutoff`,
      })
        .then(() => {
          dispatch(updateRoundFormat(wcifRound.id, newFormat));
          dispatch(updateCutoff(wcifRound.id, null));
        });
    } else {
      // if the format is changing to a format that has a cutoff
      dispatch(updateRoundFormat(wcifRound.id, newFormat));
    }
  };

  const scrambleSetCountChanged = (e) => {
    dispatch(setScrambleSetCount(wcifRound.id, parseInt(e.target.value, 10)));
  };

  const extraScrambleCountChanged = (e) => {
    dispatch(setScrambleSetCount(wcifRound.id, parseInt(e.target.value, 10)));
  };

  return (
    <Table.Row
      verticalAlign="middle"
      name={`round-${roundNumber}`}
    >
      <Table.Cell verticalAlign="middle">
        {wcifRound.id.split('-')[1].replace('r', '')}
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          selection
          name="format"
          value={wcifRound.format}
          onChange={roundFormatChanged}
          disabled
          options={event.formats().map((format) => ({
            key: format.id,
            value: format.id,
            text: format.shortName,
          }))}
          compact
        />
      </Table.Cell>

      <Table.Cell>
        <Input
          name="scrambleSetCount"
          type="number"
          min={1}
          value={wcifRound.scrambleSetCount}
          onChange={scrambleSetCountChanged}
          disabled
          style={{ width: '5em' }}
        />
      </Table.Cell>

      <Table.Cell>
        <Input
          name="extraScramblesCount"
          type="number"
          min={2}
          max={5}
          value={2}
          onChange={extraScrambleCountChanged}
        />
      </Table.Cell>
    </Table.Row>
  );
}
