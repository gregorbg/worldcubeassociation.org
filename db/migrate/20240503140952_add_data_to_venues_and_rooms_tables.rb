# frozen_string_literal: true

class AddDataToVenuesAndRoomsTables < ActiveRecord::Migration[8.1]
  def change
    add_column :competition_venues, :city, :string, null: false, after: :name
    add_column :competition_venues, :address, :string, null: false, after: :city
    add_column :competition_venues, :description, :string, after: :address
    add_column :competition_venues, :website, :string, after: :description

    change_column :competition_venues, :name, :string, limit: 240, null: false, after: :wcif_id
    change_column :competition_venues, :country_iso2, :string, null: false, limit: 2, after: :longitude_microdegrees

    add_column :venue_rooms, :description, :string, after: :name

    add_reference :competitions, :main_venue, after: :main_event_id, null: true, foreign_key: { to_table: :competition_venues, on_update: :cascade, on_delete: :nullify }
    add_column :competitions, :is_multi_location, :boolean, null: false, default: false, after: :main_venue_id
  end
end
