import {
  ChangesSaved,
  SetScrambleSetCount,
  AddScrambleSet,
  ResetScrambles,
  ToggleCurrentlyScrambling,
  SetExtraScrambleCount,
  SetMbldAttemptedCubes,
  AddExtraScramble,
  EnqueueScramblingTask,
  DequeueScramblingTask,
} from './actions';
import {
  buildExtraScrambleExtension,
  buildMultiCountExtension,
  findExtensionById,
  nextScrambleSetId,
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

  [SetMbldAttemptedCubes]: (state, { payload }) => ({
    ...state,
    wcifEvents: state.wcifEvents.map((wcifEvent) => (
      wcifEvent.id === '333mbf'
        ? updateExtensions(wcifEvent, buildMultiCountExtension(payload.numCubes))
        : wcifEvent
    )),
  }),

  [AddExtraScramble]: (state, { payload }) => ({
    ...state,
    wcifEvents: state.wcifEvents.map((event) => ({
      ...event,
      rounds: event.rounds.map((round) => ({
        ...round,
        scrambleSets: round.scrambleSets.map((scrambleSet) => (
          scrambleSet.id === payload.scrambleSetId ? {
            ...scrambleSet,
            extraScrambles: [...scrambleSet.extraScrambles, payload.extraScramble],
          } : scrambleSet
        )),
      })),
    })),
  }),

  [EnqueueScramblingTask]: (state, { payload }) => ({
    ...state,
    scramblingQueue: [
      payload.eventId,
      ...state.scramblingQueue,
    ],
  }),

  [DequeueScramblingTask]: (state, { payload }) => ({
    ...state,
    scramblingQueue: state.scramblingQueue.toSpliced(
      state.scramblingQueue.lastIndexOf(payload.eventId),
      1,
    ),
  }),
};

export default function rootReducer(state, action) {
  const reducer = reducers[action.type];
  if (reducer) {
    return reducer(state, action);
  }
  return state;
}
