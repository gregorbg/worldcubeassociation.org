export const ChangesSaved = 'saving_started';
export const SetScrambleSetCount = 'SET_SCRAMBLE_SET_COUNT';
export const SetExtraScrambleCount = 'SET_EXTRA_SCRAMBLE_COUNT';
export const AddScrambleSet = 'ADD_SCRAMBLE_SET';
export const ResetScrambles = 'RESET_SCRAMBLES';
export const ToggleCurrentlyScrambling = 'TOGGLE_CURRENTLY_SCRAMBLING';
export const OverrideCurrentlyScrambling = 'OVERRIDE_CURRENTLY_SCRAMBLING';
export const SetMbldAttemptedCubes = 'SET_MBLD_ATTEMPTED_CUBES';

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

export const setExtraScrambleCount = (roundId, numScrambles) => ({
  type: SetExtraScrambleCount,
  payload: {
    roundId,
    numScrambles,
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

export const setCurrentlyScrambling = (eventId, isScrambling = true) => ({
  type: ToggleCurrentlyScrambling,
  payload: {
    eventId,
    isScrambling,
  },
});

export const overrideCurrentlyScrambling = (currentlyScrambling) => ({
  type: OverrideCurrentlyScrambling,
  payload: {
    currentlyScrambling,
  },
});

export const setMbldAttemptedCubes = (numCubes) => ({
  type: SetMbldAttemptedCubes,
  payload: {
    numCubes,
  },
});
