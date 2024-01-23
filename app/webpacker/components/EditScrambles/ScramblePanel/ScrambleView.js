import React, { useMemo } from 'react';
import { Container } from 'semantic-ui-react';
import TwistyPlayer from './TwistyPlayer';
import { events } from '../../../lib/wca-data.js.erb';

export default function ScrambleView({ eventId, isPlaying = false, isResetting = false }) {
  const wcaEvent = useMemo(() => events.byId[eventId], [eventId]);
  const scrambleCount = useMemo(() => (wcaEvent.id === '333mbf' ? 3 : 1), [wcaEvent.id]);

  const widthPercent = 100 / scrambleCount;

  return (
    <Container fluid className="attached">
      {[...Array(scrambleCount)].map((_, i) => (
        <TwistyPlayer
          key={`player-${i}`}
          eventId={eventId}
          isPlaying={isPlaying}
          isResetting={isResetting}
          styleOverride={{ display: 'inline-grid', width: `${widthPercent}%` }}
        />
      ))}
    </Container>
  );
}
