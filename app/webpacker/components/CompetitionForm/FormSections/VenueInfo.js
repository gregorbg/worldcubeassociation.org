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

import { useFormObject, useFormUpdateAction } from '../../wca/FormBuilder/provider/FormObjectProvider';
import { toDegrees } from '../../../lib/utils/edit-schedule';
import { CompetitionsMap, StaticMarker } from '../../wca/FormBuilder/input/InputMap';
import ConditionalSection from './ConditionalSection';

export default function VenueInfo({ storedVenues = [] }) {
  const {
    mainVenueId,
    isMultiLocation,
  } = useFormObject();

  const updateFormObject = useFormUpdateAction();

  const circles = [
    { id: 'danger', radius: nearbyCompetitionDistanceDanger, color: '#d9534f' },
    { id: 'warning', radius: nearbyCompetitionDistanceWarning, color: '#f0ad4e' },
  ];

  const mainVenueOptions = useMemo(() => {
    const storedVenueOptions = storedVenues.map((venue) => ({
      key: venue.id,
      value: venue.id,
      text: venue.name,
      flag: venue.countryIso2.toLowerCase(),
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
    if (isMultiLocation) {
      updateFormObject('mainVenueId', null);
    }
  }, [isMultiLocation, updateFormObject]);

  const coords = [
    toDegrees(mainVenue?.latitudeMicrodegrees),
    toDegrees(mainVenue?.longitudeMicrodegrees),
  ];

  return (
    <>
      <InputBoolean id="isMultiLocation" />
      <ConditionalSection showIf={!isMultiLocation}>
        <InputSelect id="mainVenueId" options={mainVenueOptions} />
        {mainVenueId && (
          <div id="venue-map-wrapper">
            <CompetitionsMap
              id="map"
              coords={coords}
              draggable={false}
              scrollWheelZoom="center"
            >
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
      </ConditionalSection>
    </>
  );
}
