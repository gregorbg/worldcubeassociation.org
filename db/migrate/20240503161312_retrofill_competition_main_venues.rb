# frozen_string_literal: true

class RetrofillCompetitionMainVenues < ActiveRecord::Migration[7.1]
  def change
    Competition.includes(:competition_venues).find_each do |competition|
      venue_count = competition.competition_venues.count

      if venue_count == 1
        main_venue = competition.competition_venues.first

        venue_latitude = main_venue.latitude_microdegrees
        venue_longitude = main_venue.longitude_microdegrees

        guessed_timezone = TZF.tz_name(venue_latitude / 1e6, venue_longitude / 1e6)
        best_timezone = main_venue.timezone_id.presence || guessed_timezone

        main_venue.assign_attributes(
          city: competition.attributes['cityName'],
          address: competition.attributes['venueAddress'],
          description: competition.attributes['venueDetails'],
          timezone_id: best_timezone,
        )
      elsif venue_count == 0
        venue_country = Country.c_find!(competition.attributes['countryId'])

        timezone = 'Etc/UTC'

        comp_latitude = competition.attributes['latitude']
        comp_longitude = competition.attributes['longitude']

        if comp_latitude.present? && comp_longitude.present?
          guessed_timezone = TZF.tz_name(comp_latitude / 1e6, comp_longitude / 1e6)
          timezone = guessed_timezone || timezone
        end

        main_venue = competition.competition_venues.build(
          wcif_id: 1,
          name: competition.attributes['venue'],
          city: competition.attributes['cityName'],
          address: competition.attributes['venueAddress'],
          description: competition.attributes['venueDetails'],
          latitude_microdegrees: comp_latitude,
          longitude_microdegrees: comp_longitude,
          country_iso2: venue_country.iso2,
          timezone_id: timezone,
        )
      end

      next unless main_venue.present?

      # Legacy data sometimes does not match modern WCIF conventions. Save anyways.
      main_venue.save(validate: false)
      competition.update_attribute(:main_venue, main_venue)
    end
  end
end
