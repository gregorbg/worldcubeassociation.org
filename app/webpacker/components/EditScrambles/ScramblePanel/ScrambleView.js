import React, { useMemo } from 'react';
import { Container } from 'semantic-ui-react';
import TwistyPlayer from './TwistyPlayer';
import { events } from '../../../lib/wca-data.js.erb';
import { useStore } from '../../../lib/providers/StoreProvider';
import { isEventFullyScrambled } from '../utils';

export default function ScrambleView({ wcifEvent }) {
  const {
    currentlyScrambling: {
      [wcifEvent.id]: isScrambling,
    },
  } = useStore();

  const isReset = useMemo(() => !isEventFullyScrambled(wcifEvent), [wcifEvent]);

  const wcaEvent = useMemo(() => events.byId[wcifEvent.id], [wcifEvent.id]);
  const puzzleCount = useMemo(() => (wcaEvent.id === '333mbf' ? 3 : 1), [wcaEvent.id]);

  const widthPercent = 100 / puzzleCount;

  return (
    <Container fluid className="attached">
      {[...Array(puzzleCount)].map((_, i) => (
        <TwistyPlayer
          key={`player-${i}`}
          wcaEventId={wcaEvent.id}
          isPlaying={!!isScrambling}
          isReset={isReset}
          styleOverride={{ display: 'inline-grid', width: `${widthPercent}%` }}
        />
      ))}
    </Container>
  );
}
