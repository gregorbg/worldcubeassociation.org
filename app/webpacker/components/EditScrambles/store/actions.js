export const ChangesSaved = 'saving_started';
export const SetScrambleSetCount = 'SET_SCRAMBLE_SET_COUNT';
export const AddScrambleSet = 'ADD_SCRAMBLE_SET';
export const ResetScrambles = 'RESET_SCRAMBLES';

/**
 * Action creator for marking changes as saved
 * @returns {Action}
 */
export const changesSaved = () => ({
  type: ChangesSaved,
});

/**
 * create an action to set the scramble set count for the round
 * @param {ActivityCode} roundId
 * @param {number} newScrambleSetCount
 * @returns {Action}
 */
export const setScrambleSetCount = (roundId, scrambleSetCount) => ({
  type: SetScrambleSetCount,
  payload: {
    roundId,
    scrambleSetCount,
  },
});

export const addScrambleSet = (roundId, scrambleSet) => ({
  type: AddScrambleSet,
  payload: {
    roundId,
    scrambleSet,
  },
});

export const resetScrambles = (eventId) => ({
  type: ResetScrambles,
  payload: {
    eventId,
  },
});
