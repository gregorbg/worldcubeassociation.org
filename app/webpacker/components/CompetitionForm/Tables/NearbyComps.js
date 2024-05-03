/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import { Message } from 'semantic-ui-react';
import { competitionNearbyJsonUrl } from '../../../lib/requests/routes.js.erb';
import I18n from '../../../lib/i18n';
import CompsTable from './CompsTable';
import Loading from '../../Requests/Loading';
import TableWrapper from './TableWrapper';
import useLoadedData from '../../../lib/hooks/useLoadedData';
import { useFormObject } from '../../wca/FormBuilder/provider/FormObjectProvider';
import { toDegrees } from '../../../lib/utils/edit-schedule';
import { useStore } from '../../../lib/providers/StoreProvider';

function MissingInfo({ missingDate, missingLocation }) {
  return (
    <Message negative>
      {missingDate && (<p>{I18n.t('competitions.adjacent_competitions.no_date_yet')}</p>)}
      {missingLocation && (<p>{I18n.t('competitions.adjacent_competitions.no_location_yet')}</p>)}
    </Message>
  );
}

export default function NearbyComps() {
  const {
    competitionId,
    mainVenueId,
    startDate,
    endDate,
  } = useFormObject();

  const { storedVenues } = useStore();

  const mainVenue = useMemo(() => (
    storedVenues.find((venue) => venue.id === mainVenueId)
  ), [mainVenueId, storedVenues]);

  const lat = toDegrees(mainVenue?.latitudeMicrodegrees);
  const long = toDegrees(mainVenue?.longitudeMicrodegrees);

  const missingDate = !startDate || !endDate;
  const missingLocation = !mainVenue;

  const savedParams = useMemo(() => {
    const params = new URLSearchParams();

    if (missingDate || missingLocation) return params;

    params.append('id', competitionId);
    params.append('latitude_degrees', lat.toString());
    params.append('longitude_degrees', long.toString());
    params.append('start_date', startDate);
    params.append('end_date', endDate);

    return params;
  }, [competitionId, lat, long, startDate, endDate, missingDate, missingLocation]);

  const nearbyDataUrl = useMemo(
    () => `${competitionNearbyJsonUrl}?${savedParams.toString()}`,
    [savedParams],
  );

  const {
    data: nearby,
    loading,
  } = useLoadedData(nearbyDataUrl);

  const label = I18n.t('competitions.adjacent_competitions.label', { days: 5, kms: 10 });

  if (loading) {
    return (
      <TableWrapper label={label}>
        <Loading />
      </TableWrapper>
    );
  }

  if (missingDate || missingLocation) {
    return (
      <TableWrapper label={label}>
        <MissingInfo missingDate={missingDate} missingLocation={missingLocation} />
      </TableWrapper>
    );
  }

  return (
    <TableWrapper label={label}>
      <CompsTable comps={nearby} />
    </TableWrapper>
  );
}
