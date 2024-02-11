import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
/* eslint-disable import/no-unresolved */
import { eventInfo } from 'cubing/puzzles';
import { randomScrambleForEvent } from 'cubing/scramble';
// eslint-disable-next-line no-unused-vars
import { TwistyPlayer as ImportTwistyPlayer } from 'cubing/twisty';

export default function TwistyPlayer({
  wcaEventId,
  scramble = null,
  isPlaying = false,
  isReset = true,
  styleOverride,
}) {
  const puzzleId = useMemo(() => eventInfo(wcaEventId)?.puzzleID, [wcaEventId]);

  const getRandomScramble = useCallback(() => {
    const scrEventId = wcaEventId.replace('333mbf', '333bf');
    return randomScrambleForEvent(scrEventId);
  }, [wcaEventId]);

  const twistyRef = useRef();

  const loadScramble = useCallback((twisty) => {
    twisty.alg = scramble || getRandomScramble();
  }, [scramble, getRandomScramble]);

  const [isPlayingInternal, setIsPlayingInternal] = useState(false);

  useEffect(() => {
    if (!twistyRef.current) return;

    if (isPlaying) {
      if (!isPlayingInternal) {
        twistyRef.current.play();
      }
    } else if (isPlayingInternal) {
      twistyRef.current.jumpToEnd();
    } else if (isReset) {
      // Note: This part of the hook also triggers on initial page load,
      // making an additional "load scramble upon load" hook unnecessary.
      twistyRef.current.jumpToStart();
      loadScramble(twistyRef.current);
    }

    setIsPlayingInternal(isPlaying);
  }, [twistyRef, isPlaying, isPlayingInternal, isReset, loadScramble]);

  const animationTempo = useMemo(() => {
    switch (wcaEventId) {
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
  }, [wcaEventId]);

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
