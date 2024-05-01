import React, { useMemo } from 'react';
import { Container } from 'semantic-ui-react';
import TwistyPlayer from './TwistyPlayer';
import { events } from '../../../lib/wca-data.js.erb';

export default function ScrambleView({ wcifEvent, scramblingProgress }) {
  const wcaEvent = useMemo(() => events.byId[wcifEvent.id], [wcifEvent.id]);
  const puzzleCount = useMemo(() => (wcaEvent.id === '333mbf' ? 3 : 1), [wcaEvent.id]);

  const widthPercent = 100 / puzzleCount;

  return (
    <Container fluid className="attached">
      {[...Array(puzzleCount)].map((_, i) => (
        <TwistyPlayer
          key={`player-${i}`}
          wcaEventId={wcaEvent.id}
          scramblingProgress={scramblingProgress}
          styleOverride={{ display: 'inline-grid', width: `${widthPercent}%` }}
        />
      ))}
    </Container>
  );
}
