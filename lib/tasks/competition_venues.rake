# frozen_string_literal: true

def backfill_venue(competition)
  venue_count = competition.competition_venues.size

  if venue_count == 1
    puts "Only one venue found. Backfilling its columns with the legacy values present in the competition"

    main_venue = competition.competition_venues.first

    venue_latitude = main_venue.latitude_microdegrees
    venue_longitude = main_venue.longitude_microdegrees

    guessed_timezone = TZF.tz_name(venue_latitude / 1e6, venue_longitude / 1e6)
    best_timezone = main_venue.timezone_id.presence || guessed_timezone

    main_venue.assign_attributes(
      city: competition.attributes['city_name'],
      address: competition.attributes['venue_address'],
      description: competition.attributes['venue_details'],
      timezone_id: best_timezone,
    )
  elsif venue_count == 0
    puts "No venue found. Proceeding to create one on-the-fly"

    venue_country = Country.c_find!(competition.attributes['country_id'])

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
      city: competition.attributes['city_name'],
      address: competition.attributes['venue_address'],
      description: competition.attributes['venue_details'],
      latitude_microdegrees: comp_latitude,
      longitude_microdegrees: comp_longitude,
      country_iso2: venue_country.iso2,
      timezone_id: timezone,
    )
  end

  return if main_venue.blank?

  puts "Hooking in main venue"

  # Legacy data sometimes does not match modern WCIF conventions. Save anyways.
  main_venue.save(validate: false)
  competition.update_attribute(:main_venue, main_venue)
end

namespace :competition_venues do
  desc "Backfill all competitions currently in the database"
  task backfill_all: [:environment] do
    Competition.includes(:competition_venues).find_each do |competition|
      puts "Backfilling #{competition.name} (#{competition.id})"

      backfill_venue(competition)
    end
  end

  desc "Backfill one specific competition, supplied via competition_id"
  task :backfill, [:competition_id] => [:environment] do |_, args|
    competition_id = args[:competition_id]

    abort "Please provide a competition ID as task parameter" if competition_id.blank?
    competition = Competition.includes(:competition_venues).find(competition_id)

    backfill_venue(competition)
  end
end
