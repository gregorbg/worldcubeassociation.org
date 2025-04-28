import fetchWithJWTToken from '../../../../../lib/requests/fetchWithJWTToken';
import { paymentCaptureUrl } from '../../../../../lib/requests/routes.js.erb';

export default async function captureOrder(
  competition,
  paymentIntegrationName,
  orderData,
) {
  const route = paymentCaptureUrl(competition.id, paymentIntegrationName);
  const { data } = await fetchWithJWTToken(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return data;
}
