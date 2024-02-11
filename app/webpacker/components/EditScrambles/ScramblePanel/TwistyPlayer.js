import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
/* eslint-disable import/no-unresolved */
import { eventInfo } from 'cubing/puzzles';
import { randomScrambleForEvent } from 'cubing/scramble';
// eslint-disable-next-line no-unused-vars
import { TwistyPlayer as ImportTwistyPlayer } from 'cubing/twisty';
import { events } from '../../../lib/wca-data.js.erb';

export default function TwistyPlayer({
  eventId,
  scramble = null,
  isPlaying = false,
  styleOverride,
}) {
  const wcaEvent = useMemo(() => events.byId[eventId], [eventId]);
  const puzzleId = useMemo(() => eventInfo(eventId)?.puzzleID, [eventId]);

  const getRandomScramble = useCallback(() => {
    const scrEventId = wcaEvent.id.replace('333mbf', '333bf');
    return randomScrambleForEvent(scrEventId);
  }, [wcaEvent.id]);

  const twistyRef = useRef();

  const loadScramble = useCallback((twisty) => {
    twisty.alg = scramble || getRandomScramble();
  }, [scramble, getRandomScramble]);

  const [isPlayingInternal, setIsPlayingInternal] = useState(false);

  useEffect(() => {
    if (!twistyRef.current) return;

    loadScramble(twistyRef.current);
  }, [twistyRef, loadScramble]);

  useEffect(() => {
    if (!twistyRef.current) return;

    if (isPlaying) {
      if (!isPlayingInternal) {
        twistyRef.current.play();
      }
    } else if (isPlayingInternal) {
      twistyRef.current.jumpToStart();
      loadScramble(twistyRef.current);
    }

    setIsPlayingInternal(isPlaying);
  }, [twistyRef, isPlaying, isPlayingInternal, loadScramble]);

  const animationTempo = useMemo(() => {
    switch (eventId) {
      case '222':
        return 1;
      case '333':
      case '333bf':
      case '333fm':
      case '333mbf':
      case '333oh':
        return 2;
      case '444':
      case '444bf':
        return 3;
      case '555':
      case '555bf':
        return 4;
      case '666':
        return 5;
      case '777':
        return 6;
      case 'clock':
        return 2;
      case 'minx':
        return 5;
      case 'pyram':
        return 1;
      case 'sq1':
        return 3;
      case 'skewb':
        return 1;
      default:
        return 1;
    }
  }, [eventId]);

  return (
    <twisty-player
      background="none"
      control-panel="none"
      visualization="3D"
      hint-facelets="none"
      tempo-scale={animationTempo}
      puzzle={puzzleId}
      ref={twistyRef}
      style={styleOverride}
    />
  );
}
