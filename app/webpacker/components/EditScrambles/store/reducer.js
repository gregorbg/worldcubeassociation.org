import {
  ChangesSaved,
  SetScrambleSetCount,
  AddScrambleSet,
  ResetScrambles,
} from './actions';

/**
 * Updates 1 or more rounds
 * @param {Event[]} wcifEvents
 * @param {ActivityCode[]} roundIds
 * @param {function(Round): Partial<Round>} mapper
 * @returns {Event[]}
 */
const updateForRounds = (wcifEvents, roundIds, mapper) => wcifEvents.map((event) => ({
  ...event,
  rounds: event?.rounds?.length
    ? event.rounds.map((round) => (roundIds.includes(round.id) ? {
      ...round,
      ...mapper(round),
    } : round)) : event.rounds,
}));

const reducers = {
  [ChangesSaved]: (state) => ({
    ...state,
    initialWcifEvents: state.wcifEvents,
  }),

  [SetScrambleSetCount]: (state, { payload }) => ({
    ...state,
    wcifEvents: updateForRounds(state.wcifEvents, [payload.roundId], () => ({
      scrambleSetCount: payload.scrambleSetCount,
    })),
  }),

  [AddScrambleSet]: (state, { payload }) => ({
    ...state,
    wcifEvents: updateForRounds(state.wcifEvents, [payload.roundId], (round) => ({
      scrambleSets: [
        ...(round.scrambleSets || []),
        payload.scrambleSet,
      ],
    })),
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
};

export default function rootReducer(state, action) {
  const reducer = reducers[action.type];
  if (reducer) {
    return reducer(state, action);
  }
  return state;
}
