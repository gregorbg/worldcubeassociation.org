import React from 'react';
import { Message, List } from 'semantic-ui-react';

import {
  adminCheckExistingResultsUrl,
  panelPageUrl,
  competitionAllResultsUrl,
  personUrl,
  adminFixResultsUrl,
} from '../../../lib/requests/routes.js.erb';
import { PANEL_PAGES } from '../../../lib/wca-data.js.erb';

function AfterActionMessage({
  wcaId,
  eventId,
  competitionId,
  response,
}) {
  return (
    <>
      <Message
        positive
        header={(
          <>
            Action performed for:
            {' '}
            <a href={personUrl(wcaId)} target="_blank" rel="noreferrer">{wcaId}</a>
          </>
        )}
        list={response.messages}
      />
      <Message positive>
        <div>
          Please make sure to:
          <List ordered>
            <List.Item>
              <a
                href={adminCheckExistingResultsUrl(competitionId)}
                target="_blank"
                rel="noreferrer"
              >
                Check Competition Validators
              </a>
            </List.Item>
            <List.Item>
              <a
                href={panelPageUrl(PANEL_PAGES.checkRecords, { competitionId, eventId })}
                target="_blank"
                rel="noreferrer"
              >
                Check Records
              </a>
            </List.Item>
            <List.Item>
              <a
                href={panelPageUrl(PANEL_PAGES.computeAuxiliaryData)}
                target="_blank"
                rel="noreferrer"
              >
                Run Compute Auxiliary Data
              </a>
            </List.Item>
          </List>
          You can also
          {' '}
          <a href={competitionAllResultsUrl(competitionId, eventId)}>go back to the results</a>
          {' '}
          or you can
          {' '}
          <a
            href={adminFixResultsUrl(
              wcaId,
              competitionId,
              eventId,
            )}
          >
            go to the Fix Results entry point
          </a>
          .
        </div>
      </Message>
    </>
  );
}

export default AfterActionMessage;
