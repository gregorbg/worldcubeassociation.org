import React, { useMemo } from 'react';
import { Container } from 'semantic-ui-react';
import TwistyPlayer from './TwistyPlayer';
import { events } from '../../../lib/wca-data.js.erb';
import { useStore } from '../../../lib/providers/StoreProvider';

export default function ScrambleView({ eventId }) {
  const {
    currentlyScrambling: {
      [eventId]: isScrambling,
    },
  } = useStore();

  const wcaEvent = useMemo(() => events.byId[eventId], [eventId]);
  const scrambleCount = useMemo(() => (wcaEvent.id === '333mbf' ? 3 : 1), [wcaEvent.id]);

  const widthPercent = 100 / scrambleCount;

  return (
    <Container fluid className="attached">
      {[...Array(scrambleCount)].map((_, i) => (
        <TwistyPlayer
          key={`player-${i}`}
          eventId={eventId}
          isPlaying={!!isScrambling}
          styleOverride={{ display: 'inline-grid', width: `${widthPercent}%` }}
        />
      ))}
    </Container>
  );
}
