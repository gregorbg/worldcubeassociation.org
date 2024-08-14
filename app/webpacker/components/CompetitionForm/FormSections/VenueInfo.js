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

import { useStore } from '../../../lib/providers/StoreProvider';
import { toDegrees } from '../../../lib/utils/edit-schedule';
import { CompetitionsMap, StaticMarker } from '../../wca/FormBuilder/input/InputMap';
import { useFormObject } from '../../wca/FormBuilder/provider/FormObjectProvider';
import { useFormUpdateAction } from '../../wca/FormBuilder/EditForm';
import ConditionalSection from './ConditionalSection';

export default function VenueInfo() {
  const {
    mainVenueId,
    isMultiLocation,
  } = useFormObject();

  const { storedVenues } = useStore();

  const updateFormValue = useFormUpdateAction();

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
      updateFormValue('mainVenueId', null);
    }
  }, [isMultiLocation, updateFormValue]);

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
            <CompetitionsMap id="map" coords={coords} draggable={false}>
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
