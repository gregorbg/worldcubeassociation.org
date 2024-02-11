import {
  ChangesSaved,
  SetScrambleSetCount,
  AddScrambleSet,
  ResetScrambles,
  ToggleCurrentlyScrambling,
  OverrideCurrentlyScrambling,
  SetExtraScrambleCount, SetMbldAttemptedCubes,
} from './actions';
import {
  buildExtraScrambleExtension,
  buildMultiCountExtension,
  findExtensionById,
  nextScrambleSetId
} from '../utils';

/**
 * Updates 1 or more rounds
 * @param {Event[]} wcifEvents
 * @param {int} roundId
 * @param {function(Round): Partial<Round>} mapper
 * @returns {Event[]}
 */
const updateForRound = (wcifEvents, roundId, mapper) => wcifEvents.map((event) => (
  (event.rounds.map((round) => round.id).includes(roundId)) ? ({
    ...event,
    rounds: event.rounds.map((round) => (roundId === round.id ? ({
      ...round,
      ...mapper(round),
    }) : round)),
  }) : event));

const updateExtensions = (extendable, newExtension) => ({
  ...extendable,
  extensions: [
    {
      ...(findExtensionById(extendable, newExtension.id) || {}),
      ...newExtension,
    },
    ...extendable.extensions.filter((ext) => ext.id !== newExtension.id),
  ],
});

const reducers = {
  [ChangesSaved]: (state) => ({
    ...state,
    initialWcifEvents: state.wcifEvents,
  }),

  [SetScrambleSetCount]: (state, { payload }) => ({
    ...state,
    wcifEvents: updateForRound(state.wcifEvents, payload.roundId, () => ({
      scrambleSetCount: payload.scrambleSetCount,
    })),
  }),

  [SetExtraScrambleCount]: (state, { payload }) => ({
    ...state,
    wcifEvents: updateForRound(
      state.wcifEvents,
      payload.roundId,
      (round) => updateExtensions(
        round,
        buildExtraScrambleExtension(payload.numScrambles),
      ),
    ),
  }),

  [AddScrambleSet]: (state, { payload }) => ({
    ...state,
    wcifEvents: updateForRound(
      state.wcifEvents,
      payload.roundId,
      (round) => ({
        scrambleSets: [
          ...(round.scrambleSets || []),
          {
            ...payload.scrambleSet,
            id: nextScrambleSetId(state.wcifEvents),
          },
        ],
      }),
    ),
  }),

  [ResetScrambles]: (state, { payload }) => ({
    ...state,
    wcifEvents: state.wcifEvents.map((event) => ({
      ...event,
      rounds: event.rounds.map((round) => ({
        ...round,
        scrambleSets: event.id === payload.eventId ? [] : round.scrambleSets,
      })),
    })),
  }),

  [ToggleCurrentlyScrambling]: (state, { payload }) => ({
    ...state,
    currentlyScrambling: {
      ...state.currentlyScrambling,
      [payload.eventId]: payload.isScrambling,
    },
  }),

  [OverrideCurrentlyScrambling]: (state, { payload }) => ({
    ...state,
    currentlyScrambling: { ...payload.currentlyScrambling },
  }),

  [SetMbldAttemptedCubes]: (state, { payload }) => ({
    ...state,
    wcifEvents: state.wcifEvents.map((wcifEvent) => (
      wcifEvent.id === '333mbf'
        ? updateExtensions(wcifEvent, buildMultiCountExtension(payload.numCubes))
        : wcifEvent
    )),
  }),
};

export default function rootReducer(state, action) {
  const reducer = reducers[action.type];
  if (reducer) {
    return reducer(state, action);
  }
  return state;
}
