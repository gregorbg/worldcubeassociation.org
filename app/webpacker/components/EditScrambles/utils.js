import _ from 'lodash';

export const EXTRA_SCRAMBLE_EXTENSION_ID = 'org.worldcubeassociation.scrambles.numExtra';
export const DEFAULT_EXTRA_SCRAMBLE_COUNT = 2;
export const MULTI_CUBES_EXTENSION_ID = 'org.worldcubeassociation.scrambles.numMbldCubes';
export const DEFAULT_MBLD_CUBES_COUNT = 35;

export const findExtensionById = (extendable, id) => extendable.extensions.find(
  (ext) => ext.id === id,
);

export const getExtraScrambleCount = (wcifRound) => findExtensionById(
  wcifRound,
  EXTRA_SCRAMBLE_EXTENSION_ID,
)
  ?.data
  ?.numScrambles ?? DEFAULT_EXTRA_SCRAMBLE_COUNT;

export const buildExtraScrambleExtension = (numScrambles) => ({
  id: EXTRA_SCRAMBLE_EXTENSION_ID,
  specUrl: 'TBD',
  data: {
    numScrambles,
  },
});

export const getMbldCubesCount = (wcifEvent) => findExtensionById(
  wcifEvent,
  MULTI_CUBES_EXTENSION_ID,
)
  ?.data
  ?.numCubes ?? DEFAULT_MBLD_CUBES_COUNT;

export const buildMultiCountExtension = (numCubes) => ({
  id: MULTI_CUBES_EXTENSION_ID,
  specUrl: 'TBD',
  data: {
    numCubes,
  },
});

export const getStandardScrambleCount = (wcifRound, wcifEvent) => {
  const expectedScrambleStr = wcifRound.format.replace('m', '3').replace('a', '5');
  const baseScrambleCount = Number(expectedScrambleStr);

  return wcifEvent.id === '333mbf'
    ? getMbldCubesCount(wcifEvent) * baseScrambleCount
    : baseScrambleCount;
};

const countScrambles = (scrambleArr, eventId) => (
  eventId === '333mbf'
    ? scrambleArr.flatMap((scrString) => scrString.split('\n')).length
    : scrambleArr.length
);

export const getGeneratedScramblesCount = (wcifScrambleSet, eventId) => (
  countScrambles(wcifScrambleSet.scrambles, eventId)
    + countScrambles(wcifScrambleSet.extraScrambles, eventId)
);

export const isScrambleSetFullyScrambled = (wcifScrambleSet, wcifRound, wcifEvent) => (
  getGeneratedScramblesCount(wcifScrambleSet, wcifEvent.id) >= (
    getStandardScrambleCount(wcifRound, wcifEvent)
      + getExtraScrambleCount(wcifRound)
  )
);

export const areRoundScrambleSetsComplete = (wcifRound, wcifEvent) => (
  wcifRound.scrambleSets.every(
    (scrSet) => isScrambleSetFullyScrambled(scrSet, wcifRound, wcifEvent),
  )
);

export const isRoundFullyScrambled = (wcifRound, wcifEvent) => (
  wcifRound.scrambleSets.length >= wcifRound.scrambleSetCount
    && areRoundScrambleSetsComplete(wcifRound, wcifEvent)
);

export const isEventFullyScrambled = (wcifEvent) => (
  wcifEvent.rounds.every((round) => isRoundFullyScrambled(round, wcifEvent))
);

const maxIdOrZero = (objects) => _.max(objects.map((wcifObj) => wcifObj.id)) || 0;

export function nextScrambleSetId(wcifEvents) {
  // Explore the WCIF to get the highest ids.
  const rounds = wcifEvents.flatMap((event) => event.rounds);
  const scrambleSets = rounds.flatMap((round) => round.scrambleSets);

  return maxIdOrZero(scrambleSets) + 1;
}
