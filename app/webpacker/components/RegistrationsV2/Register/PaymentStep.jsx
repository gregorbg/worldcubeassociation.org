import React, { useCallback, useEffect, useState } from 'react';
import {
  Checkbox,
  Divider,
  Form,
  FormField,
  Header,
  Label,
  Message,
  Segment,
} from 'semantic-ui-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { paymentFinishUrl } from '../../../lib/requests/routes.js.erb';
import { useDispatch } from '../../../lib/providers/StoreProvider';
import { showMessage } from './RegistrationMessage';
import Loading from '../../Requests/Loading';
import I18n from '../../../lib/i18n';
import useCheckboxState from '../../../lib/hooks/useCheckboxState';
import { hasPassed } from '../../../lib/utils/dates';
import AutonumericField from '../../wca/FormBuilder/input/AutonumericField';
import getPaymentTicket from '../api/payment/get/getPaymentTicket';
import { useRegistration } from '../lib/RegistrationProvider';
import captureOrder from '../api/payment/get/captureOrder';

export default function PaymentStep({
  competitionInfo,
  setIsoDonationAmount,
  isoDonationAmount,
  displayAmount,
  nextStep,
}) {
  const dispatch = useDispatch();

  const { registration } = useRegistration();

  const [isLoading, setIsLoading] = useState(false);
  const [isDonationChecked, setDonationChecked] = useCheckboxState(false);

  useEffect(() => {
    // TODO When we add per Event Payment this logic needs to also check
    //  if an additional payment is needed
    if (registration?.payment?.has_paid) {
      nextStep();
    }
  }, [nextStep, registration]);

  const createOrder = useCallback(async () => {
    // Create the PaymentIntent and obtain clientSecret
    const paymentTicket = await getPaymentTicket(competitionInfo, isoDonationAmount);

    return paymentTicket.client_secret;
  }, [competitionInfo, isoDonationAmount]);

  const handlePaypalError = useCallback((sdkError, isManualCancel = false) => {
    dispatch(showMessage('registrations.payment_form.errors.generic.failed', 'error', {
      provider: I18n.t('payments.payment_providers.paypal'),
    }));
  }, [dispatch]);

  const onApprove = useCallback(async (data, actions) => {
    // Create the PaymentIntent and obtain clientSecret
    const capturedOrder = await captureOrder(competitionInfo, 'paypal', data);
    const orderId = capturedOrder.id;

    const rawReturnUrl = paymentFinishUrl(competitionInfo.id, 'paypal');
    const returnUrl = `${rawReturnUrl}?orderID=${orderId}`;

    return actions.redirect(returnUrl);
  }, [competitionInfo]);

  if (hasPassed(competitionInfo.registration_close)) {
    return (
      <Message color="red">{I18n.t('registrations.payment_form.errors.registration_closed')}</Message>
    );
  }

  return (
    <Segment>
      <Form id="payment-form">
        <Divider />
        { competitionInfo.enable_donations && (
          <FormField>
            <Checkbox
              id="useDonationCheckbox"
              value={isDonationChecked}
              onChange={(event, data) => {
                setDonationChecked(event, data);
                setIsoDonationAmount(0);
              }}
              label={I18n.t('registrations.payment_form.labels.show_donation')}
            />
            { isDonationChecked && (
            <AutonumericField
              id="donationInputField"
              onChange={(_, { value }) => setIsoDonationAmount(value)}
              currency={competitionInfo.currency_code}
              value={isoDonationAmount}
              label={(
                <Label>
                  {I18n.t('registrations.payment_form.labels.donation')}
                </Label>
              )}
            />
            )}
          </FormField>
        )}
        { isLoading
          ? <Loading />
          : (
            <>
              <Header size="small" id="money-subtotal">
                {I18n.t('registrations.payment_form.labels.subtotal')}
                :
                {' '}
                {displayAmount}
              </Header>
              <Divider hidden />
              <PayPalButtons
                onCancel={(err) => handlePaypalError(err, true)}
                onError={(err) => handlePaypalError(err, false)}
                createOrder={createOrder}
                onApprove={onApprove}
              />
            </>
          )}
      </Form>
    </Segment>
  );
}
