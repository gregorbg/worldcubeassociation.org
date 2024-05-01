import React, { useCallback, useMemo } from 'react';

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
  addExtraScramble, setCurrentlyScrambling,
  setExtraScrambleCount,
  setScrambleSetCount,
} from '../store/actions';
import {
  areRoundScrambleSetsComplete,
  DEFAULT_EXTRA_SCRAMBLE_COUNT,
  getExtraScrambleCount,
} from '../utils';

export default function RoundRow({
  index,
  wcifRound,
  wcifEvent,
}) {
  const {
    currentlyScrambling: {
      [wcifEvent.id]: isScrambling,
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
  const fullyScrambledSoFar = areRoundScrambleSetsComplete(wcifRound, wcifEvent);

  const addExtraScrambles = useCallback(() => {
    dispatch(setCurrentlyScrambling(wcifEvent.id, true));

    const scrambleSetPromises = wcifRound.scrambleSets.map((scrSet) => {
      const scrEventId = wcifEvent.id.replace('333mbf', '333bf');

      return randomScrambleForEvent(scrEventId).then((cubingScr) => {
        dispatch(addExtraScramble(scrSet.id, cubingScr.toString()));
      });
    });

    Promise.all(scrambleSetPromises)
      .finally(() => {
        dispatch(setExtraScrambleCount(wcifRound.id, getExtraScrambleCount(wcifRound) + 1));
        dispatch(setCurrentlyScrambling(wcifEvent.id, false));
      });
  }, [dispatch, wcifEvent.id, wcifRound]);

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
        {scramblesExist && fullyScrambledSoFar && (
          <Button
            positive
            icon
            compact
            size="tiny"
            disabled={isScrambling}
            onClick={addExtraScrambles}
          >
            <Icon name="plus" />
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
