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
  scramblingProgress,
  styleOverride,
}) {
  const puzzleId = useMemo(() => eventInfo(wcaEventId)?.puzzleID, [wcaEventId]);

  const getRandomScramble = useCallback(() => {
    const scrEventId = wcaEventId.replace('333mbf', '333bf');
    return randomScrambleForEvent(scrEventId);
  }, [wcaEventId]);

  const twistyRef = useRef();

  const [moveIndexer, setMoveIndexer] = useState();

  const loadScramble = useCallback((twisty) => {
    // eslint-disable-next-line no-param-reassign
    twisty.alg = scramble || getRandomScramble();

    twisty.controller.jumpToStart();
    twisty.controller.model.indexer.get().then(setMoveIndexer);
  }, [scramble, getRandomScramble]);

  useEffect(() => {
    if (!twistyRef.current) return;

    loadScramble(twistyRef.current);
  }, [twistyRef, loadScramble]);

  useEffect(() => {
    if (!twistyRef.current) return;
    if (!moveIndexer) return;

    const exactPosition = moveIndexer.numAnimatedLeaves() * scramblingProgress;

    const moveIndex = Math.round(exactPosition);
    const moveStartTime = moveIndexer.indexToMoveStartTimestamp(moveIndex);

    // It feels awkward to display "in progress" moves in the middle of a turn,
    // so we round to either the start (0) or the end (1) of a move.
    const moveProgress = Math.round(exactPosition - moveIndex);
    const movePartialDuration = moveIndexer.moveDuration(moveIndex) * moveProgress;

    twistyRef.current.controller.model.timestampRequest.set(moveStartTime + movePartialDuration);
  }, [twistyRef, moveIndexer, scramblingProgress]);

  return (
    <twisty-player
      background="none"
      control-panel="none"
      visualization="3D"
      hint-facelets="none"
      puzzle={puzzleId}
      ref={twistyRef}
      style={styleOverride}
    />
  );
}
