# frozen_string_literal: true

class RenamePhpColumns < ActiveRecord::Migration[7.0]
  def change
    change_table :Competitions do |t|
      t.rename :cityName, :city_name
      t.rename :countryId, :country_id
      t.rename :venueAddress, :venue_address
      t.rename :venueDetails, :venue_details
      t.rename :cellName, :cell_name
      t.rename :showAtAll, :show_at_all
    end

    rename_table :Competitions, :competitions

    change_table :CompetitionsMedia do |t|
      t.rename :type, :media_type
      t.rename :competitionId, :competition_id
      t.rename :submitterName, :submitter_name
      t.rename :submitterComment, :submitter_comment
      t.rename :submitterEmail, :submitter_email
      t.rename :timestampSubmitted, :submitted_at
      t.rename :timestampDecided, :decided_at
    end

    rename_table :CompetitionsMedia, :competition_media
  end
end
