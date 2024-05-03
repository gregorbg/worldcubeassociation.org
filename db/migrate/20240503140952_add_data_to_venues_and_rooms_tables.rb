# frozen_string_literal: true

class AddDataToVenuesAndRoomsTables < ActiveRecord::Migration[7.1]
  def change
    change_table :competition_venues, bulk: true do |t|
      # rubocop:disable Rails/NotNullColumn
      #   We're accepting these not-null columns without default value because they are
      #   also NOT NULL in the original `competitions` table and we will backfill its values later.
      t.string :city, null: false, after: :name
      t.string :address, null: false, after: :city
      # rubocop:enable Rails/NotNullColumn
      t.string :description, after: :address
      t.string :website, after: :description
    end

    reversible do |direction|
      direction.up do
        change_column :competition_venues, :name, :string, null: false, limit: 240, after: :wcif_id
        change_column :competition_venues, :country_iso2, :string, null: false, limit: 2, after: :longitude_microdegrees
      end

      direction.down do
        change_column :competition_venues, :name, :string, null: false
        change_column :competition_venues, :country_iso2, :string, null: false
      end
    end

    add_column :venue_rooms, :description, :string, after: :name

    add_reference :competitions, :main_venue, after: :main_event_id, null: true, foreign_key: { to_table: :competition_venues }, index: false
    add_column :competitions, :is_multi_location, :boolean, null: false, default: false, after: :main_venue_id
  end
end
