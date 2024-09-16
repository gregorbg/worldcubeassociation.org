import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Card,
  Container,
  DropdownHeader,
  Form,
  Icon,
  Image,
} from 'semantic-ui-react';
import _ from 'lodash';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import VenueLocationMap from './VenueLocationMap';
import { countries, backendTimezones } from '../../../lib/wca-data.js.erb';
import RoomPanel from './RoomPanel';
import { useDispatch } from '../../../lib/providers/StoreProvider';
import { useConfirm } from '../../../lib/providers/ConfirmProvider';
import {
  addRoom,
  editVenue,
  removeVenue,
} from '../store/actions';
import { toDegrees, toMicrodegrees } from '../../../lib/utils/edit-schedule';
import { fetchWithAuthenticityToken } from '../../../lib/requests/fetchWithAuthenticityToken';
import { geocodingTimeZoneUrl } from '../../../lib/requests/routes.js.erb';
import { getTimeZoneDropdownLabel, sortByOffset } from '../../../lib/utils/timezone';

const countryOptions = countries.real.map((country) => ({
  key: country.iso2,
  text: country.name,
  value: country.iso2,
  flag: country.iso2.toLowerCase(),
}));

function VenuePanel({
  venue,
  countryZones,
  referenceTime,
}) {
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const handleCoordinateChange = (evt, { name, value }) => {
    dispatch(editVenue(venue.id, name, toMicrodegrees(value)));
  };

  const handleVenueChange = (evt, { name, value }) => {
    dispatch(editVenue(venue.id, name, value));
  };

  const handleDeleteVenue = () => {
    confirm({
      content: `Are you sure you want to delete the venue ${venue.name}? This will also delete all associated rooms and all associated schedules. THIS ACTION CANNOT BE UNDONE!`,
    }).then(() => dispatch(removeVenue(venue.id)));
  };

  const handleAddRoom = () => {
    dispatch(addRoom(venue.id));
  };

  const getVenueTzDropdownLabel = useCallback(
    // The whole page is not localized yet, so we just hard-code US English here as well.
    (tzId) => getTimeZoneDropdownLabel(tzId, referenceTime, 'en-US'),
    [referenceTime],
  );

  const makeTimeZoneOption = useCallback((key) => ({
    key,
    text: getVenueTzDropdownLabel(key),
    value: key,
  }), [getVenueTzDropdownLabel]);

  // Instead of giving *all* TZInfo, use uniq-fied rails "meaningful" subset
  // We'll add the "country_zones" to that, because some of our competitions
  // use TZs not included in this subset.
  // We want to display the "country_zones" first, so that it's more convenient for the user.
  // In the end the array should look like that:
  //   - country_zone_a, country_zone_b, [...], other_tz_a, other_tz_b, [...]
  const timezoneOptions = useMemo(() => {
    // Stuff that is recommended based on the country list
    const competitionZoneIds = _.uniq(Object.values(countryZones));
    const sortedCompetitionZones = sortByOffset(competitionZoneIds, referenceTime);

    // Stuff that is listed in our `backendTimezones` list but not in the preferred country list
    const otherZoneIds = _.difference(backendTimezones, competitionZoneIds);
    const sortedOtherZones = sortByOffset(otherZoneIds, referenceTime);

    // Both merged together, with the countryZone entries listed first.
    return [
      {
        as: DropdownHeader,
        key: 'local-zones-header',
        text: 'Local time zones',
        disabled: true,
      },
      ...sortedCompetitionZones.map(makeTimeZoneOption),
      {
        as: DropdownHeader,
        key: 'other-zones-header',
        text: 'Other time zones',
        disabled: true,
      },
      ...sortedOtherZones.map(makeTimeZoneOption),
    ];
  }, [countryZones, referenceTime, makeTimeZoneOption]);

  const fetchSuggestedTimeZones = useCallback(async () => {
    const url = `${geocodingTimeZoneUrl}?${new URLSearchParams({
      lat: venue.latitudeMicrodegrees,
      lng: venue.longitudeMicrodegrees,
    }).toString()}`;

    const response = await fetchWithAuthenticityToken(url);
    return response.json();
  }, [venue.latitudeMicrodegrees, venue.longitudeMicrodegrees]);

  const {
    data: suggestedTimeZones,
    isLoading: timeZonesLoading,
    isError: timeZonesError,
  } = useQuery({
    queryFn: fetchSuggestedTimeZones,
    queryKey: ['suggested-tz', venue.latitudeMicrodegrees, venue.longitudeMicrodegrees],
    enabled: Boolean(venue.latitudeMicrodegrees && venue.longitudeMicrodegrees),
    placeholderData: keepPreviousData,
  });

  const bestMatch = useMemo(() => suggestedTimeZones?.find(
    (tz) => timezoneOptions.some((tzOpt) => tzOpt.key === tz),
  ), [suggestedTimeZones, timezoneOptions]);

  const handleDetectTimezone = async (evt) => {
    if (bestMatch) {
      handleVenueChange(evt, { name: 'timezone', value: bestMatch });
    }
  };

  return (
    <Card fluid raised>
      { /* Needs the className 'image' so that SemUI fills the top of the card */ }
      <Container as={Image} className="venue-map" style={{ height: '300px' }}>
        <VenueLocationMap
          venue={venue}
        />
      </Container>
      <Card.Content>
        <Card.Header>
          <Button floated="right" compact icon labelPosition="left" negative onClick={handleDeleteVenue}>
            <Icon name="trash" />
            Remove
          </Button>
        </Card.Header>
        <Card.Description>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                label="Latitude"
                name="latitudeMicrodegrees"
                value={toDegrees(venue.latitudeMicrodegrees)}
                onChange={handleCoordinateChange}
              />
              <Form.Input
                label="Longitude"
                name="longitudeMicrodegrees"
                value={toDegrees(venue.longitudeMicrodegrees)}
                onChange={handleCoordinateChange}
              />
            </Form.Group>
            <Form.Input
              id="venue-name"
              label="Name"
              name="name"
              value={venue.name}
              onChange={handleVenueChange}
            />
            <Form.Select
              search
              label="Country"
              name="countryIso2"
              options={countryOptions}
              value={venue.countryIso2}
              onChange={handleVenueChange}
            />
            {bestMatch && (
              <Button
                floated="right"
                compact
                icon
                labelPosition="left"
                primary
                negative={timeZonesError}
                disabled={timeZonesLoading}
                onClick={handleDetectTimezone}
              >
                <Icon name="target" />
                Use coordinate timezone
                <div>{bestMatch}</div>
              </Button>
            )}
            <Form.Select
              label="Timezone"
              name="timezone"
              options={timezoneOptions}
              value={venue.timezone}
              onChange={handleVenueChange}
            />
          </Form>
        </Card.Description>
      </Card.Content>
      <Card.Content>
        <Card.Header>
          <Button floated="right" compact icon labelPosition="left" positive onClick={handleAddRoom}>
            <Icon name="add" />
            Add room
          </Button>
          Rooms
        </Card.Header>
        <Card.Description>
          <Card.Group itemsPerRow={2}>
            {venue.rooms.map((room) => (
              <RoomPanel
                key={room.id}
                room={room}
              />
            ))}
          </Card.Group>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default VenuePanel;
