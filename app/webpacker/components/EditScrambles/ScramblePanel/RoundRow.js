import React, { useMemo, useState } from 'react';

import {
  Button,
  Icon,
  Input,
  Table,
} from 'semantic-ui-react';
import { randomScrambleForEvent } from 'cubing/scramble';
import { formats } from '../../../lib/wca-data.js.erb';

import { useDispatch, useStore } from '../../../lib/providers/StoreProvider';
import {
  addExtraScramble,
  setExtraScrambleCount,
  setScrambleSetCount,
} from '../store/actions';
import {
  DEFAULT_EXTRA_SCRAMBLE_COUNT,
  getExtraScrambleCount,
  isRoundScrambled,
} from '../utils';

export default function RoundRow({
  index,
  wcifRound,
  eventId,
}) {
  const {
    currentlyScrambling: {
      [eventId]: isScrambling,
    },
  } = useStore();

  const dispatch = useDispatch();

  const roundNumber = index + 1;

  const scrambleSetCountChanged = (e) => {
    dispatch(setScrambleSetCount(wcifRound.id, parseInt(e.target.value, 10)));
  };

  const extraScrambleCountChanged = (e) => {
    dispatch(setExtraScrambleCount(wcifRound.id, parseInt(e.target.value, 10)));
  };

  const wcaFormat = useMemo(() => formats.byId[wcifRound.format], [wcifRound.format]);

  const scramblesExist = wcifRound.scrambleSets.length > 0;
  const fullyScrambled = isRoundScrambled(wcifRound);

  const [generatingExtraScramble, setGeneratingExtraScramble] = useState(false);

  const addExtraScrambles = () => {
    setGeneratingExtraScramble(true);

    const scrambleSetPromises = wcifRound.scrambleSets.map((scrSet) => {
      const scrEventId = eventId.replace('333mbf', '333bf');

      return randomScrambleForEvent(scrEventId).then((cubingScr) => {
        dispatch(addExtraScramble(scrSet.id, cubingScr.toString()));
      });
    });

    Promise.all(scrambleSetPromises)
      .finally(() => {
        dispatch(setExtraScrambleCount(wcifRound.id, getExtraScrambleCount(wcifRound) + 1));
        setGeneratingExtraScramble(false);
      });
  };

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
          min={Math.max(wcifRound.scrambleSets.length, 1)}
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
          disabled={scramblesExist}
        />
        {fullyScrambled && !isScrambling && (
          <Button
            positive
            icon
            compact
            size="tiny"
            disabled={generatingExtraScramble}
            onClick={addExtraScrambles}
          >
            <Icon name="plus" />
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
