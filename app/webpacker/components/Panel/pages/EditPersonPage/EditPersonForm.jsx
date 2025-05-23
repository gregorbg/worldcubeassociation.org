import React, { useState, useEffect } from 'react';
import {
  Button, Form, Header, Icon, Message,
} from 'semantic-ui-react';
import _ from 'lodash';
import { panelPageUrl, apiV0Urls, personUrl } from '../../../../lib/requests/routes.js.erb';
import { PANEL_PAGES } from '../../../../lib/wca-data.js.erb';
import useSaveAction from '../../../../lib/hooks/useSaveAction';
import Loading from '../../../Requests/Loading';
import I18n from '../../../../lib/i18n';
import useLoadedData from '../../../../lib/hooks/useLoadedData';
import Errored from '../../../Requests/Errored';
import UtcDatePicker from '../../../wca/UtcDatePicker';
import RegionSelector from '../../../wca/RegionSelector';
import GenderSelector from '../../../wca/GenderSelector';

export default function EditPersonForm({ wcaId, onSuccess, showDestroyButton = false }) {
  const {
    data: personFetchData, loading, error: personError,
  } = useLoadedData(
    apiV0Urls.persons.show(wcaId),
  );
  const { person } = personFetchData || {};
  const [editedUserDetails, setEditedUserDetails] = useState();
  const [originalUserDetails, setOriginalUserDetails] = useState();
  const [incorrectClaimCount, setIncorrectClaimCount] = useState(0);
  const [response, setResponse] = useState();
  const { save, saving } = useSaveAction();

  useEffect(() => {
    if (person) {
      const userDetails = {
        wcaId: person.wca_id,
        name: person.name,
        representing: person.country_iso2,
        gender: person.gender,
        dob: person.dob,
      };
      setOriginalUserDetails(userDetails);
      setEditedUserDetails(userDetails);
      setIncorrectClaimCount(person.incorrect_wca_id_claim_count);
      setResponse(null);
    } else {
      setOriginalUserDetails(null);
      setEditedUserDetails(null);
      setIncorrectClaimCount(0);
    }
  }, [person, setResponse]);

  const handleFormChange = (e, { name: formName, value }) => {
    setEditedUserDetails((prev) => ({ ...prev, [formName]: value }));
  };

  const handleDobChange = (date) => handleFormChange(null, {
    name: 'dob',
    value: date,
  });

  const editPerson = (method) => {
    save(apiV0Urls.wrt.edit(wcaId), {
      person: editedUserDetails,
      method,
    }, () => {
      setResponse({
        success: true,
        showCountryChangeWarning:
          originalUserDetails.representing !== editedUserDetails.representing,
      });
      if (onSuccess) {
        onSuccess();
      }
    }, {
      method: 'PATCH',
    }, (error) => {
      setResponse({
        success: false,
        message: `${error}`,
      });
    });
  };

  const handleDestroy = () => {
    save(apiV0Urls.wrt.destroy(wcaId), {}, () => {
      setResponse({ success: true });
    }, { method: 'DELETE' }, (error) => setResponse({ success: false, message: `${error}` }));
  };

  const handleResetClaimCount = () => {
    save(apiV0Urls.wrt.resetClaimCount(wcaId), {}, () => {
      setResponse({ success: true, message: 'Success' });
    }, { method: 'PUT' }, (error) => setResponse({ success: false, message: `${error}` }));
  };

  if (loading || saving) return <Loading />;
  if (personError) return <Errored />;

  return (
    <>
      {response != null && (
        <Message
          success={response.success}
          error={!response.success}
          content={response.message}
        >
          <Message.Content>
            {response.success && (
              <>
                Success!
                <br />
              </>
            )}
            {response.showCountryChangeWarning && (
              <>
                The change you made may have affected national and continental records, be sure to
                run
                {' '}
                <a href={panelPageUrl(PANEL_PAGES.checkRecords)}>check_regional_record_markers</a>
                .
              </>
            )}
            {!response.success && response.message}
          </Message.Content>
        </Message>
      )}
      <Header as="h3">
        WCA ID:
        {' '}
        <a href={personUrl(wcaId)}>
          {wcaId}
        </a>
      </Header>
      <Form>
        <Form.Input
          label={I18n.t('activerecord.attributes.user.name')}
          name="name"
          disabled={!editedUserDetails}
          value={editedUserDetails?.name || ''}
          onChange={handleFormChange}
        />
        <RegionSelector
          label={I18n.t('activerecord.attributes.user.country_iso2')}
          name="representing"
          onlyCountries
          disabled={!editedUserDetails}
          region={editedUserDetails?.representing || ''}
          onRegionChange={handleFormChange}
        />
        <GenderSelector
          name="gender"
          disabled={!editedUserDetails}
          gender={editedUserDetails?.gender || ''}
          onChange={handleFormChange}
        />
        <Form.Field
          label={I18n.t('activerecord.attributes.user.dob')}
          name="dob"
          control={UtcDatePicker}
          showYearDropdown
          dateFormatOverride="yyyy-MM-dd"
          dropdownMode="select"
          disabled={!editedUserDetails}
          isoDate={editedUserDetails?.dob}
          onChange={handleDobChange}
        />
        <Button
          disabled={_.isEqual(editedUserDetails, originalUserDetails) || !editedUserDetails}
          onClick={() => editPerson('fix')}
        >
          <Icon name="wrench" />
          Fix
        </Button>
        <Button
          disabled={_.isEqual(editedUserDetails, originalUserDetails) || !editedUserDetails}
          onClick={() => editPerson('update')}
        >
          <Icon name="clone" />
          Update
        </Button>
        {showDestroyButton && (
          <Button disabled={!editedUserDetails} onClick={handleDestroy}>
            <Icon name="trash" />
            Destroy
          </Button>
        )}
        {incorrectClaimCount > 0 && (
          <Button onClick={handleResetClaimCount}>
            <Icon name="redo" />
            Reset Claim Count
          </Button>
        )}
      </Form>
    </>
  );
}
