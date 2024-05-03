import React, { useEffect, useMemo } from 'react';
import { Circle } from 'react-leaflet';
import {
  nearbyCompetitionDistanceDanger,
  nearbyCompetitionDistanceWarning,
} from '../../../lib/wca-data.js.erb';
import {
  InputBoolean,
  InputSelect,
} from '../../wca/FormBuilder/input/FormInputs';

import { useDispatch, useStore } from '../../../lib/providers/StoreProvider';
import { toDegrees } from '../../../lib/utils/edit-schedule';
import { CompetitionsMap, StaticMarker } from '../../wca/FormBuilder/input/InputMap';
import { updateFormValue } from '../../wca/FormBuilder/store/actions';

export default function VenueInfo() {
  const {
    competition: {
      mainVenueId,
      isMultiLocation,
    },
    storedVenues,
  } = useStore();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isMultiLocation) {
      dispatch(updateFormValue('mainVenueId', null));
    }
  }, [isMultiLocation, dispatch]);

  const circles = [
    { id: 'danger', radius: nearbyCompetitionDistanceDanger, color: '#d9534f' },
    { id: 'warning', radius: nearbyCompetitionDistanceWarning, color: '#f0ad4e' },
  ];

  const mainVenueOptions = useMemo(() => {
    const storedVenueOptions = storedVenues.map((venue) => ({
      key: venue.id,
      value: venue.id,
      text: venue.name,
    }));

    return [{
      key: '',
      value: '',
      text: '',
    }, ...storedVenueOptions];
  }, [storedVenues]);

  const mainVenue = useMemo(() => (
    storedVenues.find((venue) => venue.id === mainVenueId)
  ), [mainVenueId, storedVenues]);

  useEffect(() => {
    if (mainVenue) {
      dispatch(updateFormValue('isMultiLocation', false));
    }
  }, [mainVenue, dispatch]);

  const coords = [
    toDegrees(mainVenue?.latitudeMicrodegrees),
    toDegrees(mainVenue?.longitudeMicrodegrees),
  ];

  return (
    <>
      <InputSelect id="mainVenueId" options={mainVenueOptions} />
      {mainVenueId && (
        <div id="venue-map-wrapper">
          <CompetitionsMap id="map" coords={coords}>
            {circles.map((circle) => (
              <Circle
                key={circle.id}
                center={coords}
                fill={false}
                radius={circle.radius * 1000}
                color={circle.color}
              />
            ))}
            <StaticMarker coords={coords} disabled />
          </CompetitionsMap>
        </div>
      )}
      <InputBoolean id="isMultiLocation" />
    </>
  );
}
