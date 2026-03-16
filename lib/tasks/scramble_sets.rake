# frozen_string_literal: true

namespace :scramble_sets do
  desc "Backfill old redundant data into new scramble_sets table"
  task backfill_sets_data: :environment do
    upsert_data = Scramble.pluck(:id, :scramble_num, :is_extra, :scramble)
    upsert_attributes = upsert_data.map { %i[scramble_set_id scramble_number is_extra scramble_string].zip(it).to_h }

    IndividualScramble.upsert_all(upsert_attributes)
  end
end
