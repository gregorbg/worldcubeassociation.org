import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import _ from 'lodash';

import {
  Button,
  Card,
  Divider,
  Icon,
  Message,
} from 'semantic-ui-react';

import { useSaveWcifAction } from '../../lib/utils/wcif';
import ScramblePanel from './ScramblePanel';
import { changesSaved } from './store/actions';
import wcifEventsReducer from './store/reducer';
import Store, { useDispatch, useStore } from '../../lib/providers/StoreProvider';
import ConfirmProvider from '../../lib/providers/ConfirmProvider';
import { isEventFullyScrambled, useScramblingAction } from './utils';

function EditScrambles() {
  const {
    competitionId,
    wcifEvents,
    initialWcifEvents,
    currentlyScrambling,
  } = useStore();

  const dispatch = useDispatch();

  const unsavedChanges = useMemo(() => (
    !_.isEqual(wcifEvents, initialWcifEvents)
  ), [wcifEvents, initialWcifEvents]);

  const onUnload = useCallback((e) => {
    // Prompt the user before letting them navigate away from this page with unsaved changes.
    if (unsavedChanges) {
      const confirmationMessage = 'You have unsaved changes, are you sure you want to leave?';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }

    return null;
  }, [unsavedChanges]);

  useEffect(() => {
    window.addEventListener('beforeunload', onUnload);

    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [onUnload]);

  const { saveWcif, saving } = useSaveWcifAction();

  const save = useCallback(() => {
    saveWcif(
      competitionId,
      { events: wcifEvents },
      () => dispatch(changesSaved()),
    );
  }, [competitionId, dispatch, saveWcif, wcifEvents]);

  const renderUnsavedChangesAlert = () => (
    <Message color="blue">
      You have unsaved changes. Don&apos;t forget to
      {' '}
      <Button
        onClick={save}
        disabled={saving}
        loading={saving}
        color="blue"
      >
        save your changes!
      </Button>
    </Message>
  );

  const generateScramblesAction = useScramblingAction();

  const scrambleAll = useCallback(() => {
    wcifEvents
      .filter((wcifEvent) => !isEventFullyScrambled(wcifEvent))
      .forEach(generateScramblesAction);
  }, [wcifEvents, generateScramblesAction]);

  const hasWorkToScramble = useMemo(
    () => !wcifEvents.every((wcifEvent) => isEventFullyScrambled(wcifEvent)),
    [wcifEvents],
  );

  const isAnyScrambling = useMemo(
    () => wcifEvents.some((wcifEvent) => currentlyScrambling[wcifEvent.id]),
    [wcifEvents, currentlyScrambling],
  );

  const canScramble = hasWorkToScramble && !isAnyScrambling;

  return (
    <>
      {unsavedChanges && renderUnsavedChangesAlert()}
      <Button fluid positive icon size="huge" onClick={scrambleAll} disabled={!canScramble}>
        <Icon name="shuffle" />
        Scramble all
      </Button>
      <Divider />
      <Card.Group
        itemsPerRow={3}
        className="stackable"
        // this is necessary so that the cards "wrap" instead of growing to match the longest card
        style={{ alignItems: 'baseline' }}
      >
        {wcifEvents.map((wcifEvent) => (
          <ScramblePanel key={wcifEvent.id} wcifEvent={wcifEvent} />
        ))}
      </Card.Group>
      {unsavedChanges && renderUnsavedChangesAlert()}
    </>
  );
}

export default function Wrapper({
  competitionId,
  canUpdateEvents,
  wcifEvents,
  wcifSchedule,
}) {
  return (
    <Store
      reducer={wcifEventsReducer}
      initialState={{
        competitionId,
        canUpdateEvents,
        wcifEvents,
        wcifSchedule,
        initialWcifEvents: wcifEvents,
        unsavedChanges: false,
        currentlyScrambling: {},
      }}
    >
      <ConfirmProvider>
        <EditScrambles />
      </ConfirmProvider>
    </Store>
  );
}
