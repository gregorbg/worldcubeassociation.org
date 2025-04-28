// Roughly rollowing https://developer.paypal.com/docs/multiparty/checkout/standard/integrate/#integrate-front-end
import React, { useState } from 'react';
import { Header, Message } from 'semantic-ui-react';
import { useQuery } from '@tanstack/react-query';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import I18n from '../../../lib/i18n';
import PaymentStep from './PaymentStep';
import { fetchJsonOrError } from '../../../lib/requests/fetchWithAuthenticityToken';
import { paymentDenominationUrl } from '../../../lib/requests/routes.js.erb';
import { useRegistration } from '../lib/RegistrationProvider';

const convertISOAmount = async (competitionId, userId, isoDonationAmount) => {
  const { data } = await fetchJsonOrError(
    paymentDenominationUrl(competitionId, userId, isoDonationAmount),
  );
  return data;
};

export default function PaypalWrapper({
  competitionInfo,
  paypalPublishableKey,
  connectedAccountId,
  user,
  nextStep,
}) {
  const initialAmount = competitionInfo.base_entry_fee_lowest_denomination;
  const [isoDonationAmount, setIsoDonationAmount] = useState(0);

  const { registration } = useRegistration();

  const {
    data, isFetching,
  } = useQuery({
    queryFn: () => convertISOAmount(competitionInfo.id, registration.user_id, isoDonationAmount),
    queryKey: ['displayAmount', isoDonationAmount, competitionInfo.id, registration.user_id],
  });

  return (
    <>
      <Header>Payment</Header>
      <Message positive>
        {I18n.t('registrations.payment_form.hints.payment_button')}
      </Message>
      { isoDonationAmount > initialAmount && (
      <Message warning>
        {I18n.t('registrations.payment_form.alerts.amount_rather_high')}
      </Message>
      )}
      <PayPalScriptProvider
        options={{
          clientId: paypalPublishableKey,
          merchantId: connectedAccountId,
          currency: competitionInfo.currency_code,
        }}
      >
        <PaymentStep
          setIsoDonationAmount={setIsoDonationAmount}
          competitionInfo={competitionInfo}
          user={user}
          isoDonationAmount={isoDonationAmount}
          displayAmount={data?.human_amount}
          registration={registration}
          nextStep={nextStep}
          conversionFetching={isFetching}
        />
      </PayPalScriptProvider>
    </>
  );
}
