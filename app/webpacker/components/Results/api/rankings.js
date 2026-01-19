import { fetchJsonOrError } from '../../../lib/requests/fetchWithAuthenticityToken';
import { rankingsUrl } from '../../../lib/requests/routes.js.erb';

// eslint-disable-next-line import/prefer-default-export
export async function getRankings(eventId, rankingType, region, gender, show, years) {
  const { data } = await fetchJsonOrError(rankingsUrl(eventId, rankingType, region, gender, show, years), { headers: { Accept: 'application/json' } });
  return data;
}
