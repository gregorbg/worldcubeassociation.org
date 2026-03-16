# frozen_string_literal: true

namespace :scramble_sets do
  desc "Backfill old redundant data into new scramble_sets table"
  task backfill_sets_data: :environment do
    unique_sets_data = Scramble
                       .where.not(scramble: Scramble::BACKFILLING_SCRAMBLE)
                       .group(:round_id, :group_id)
                       .select('MIN(id)')

    Scramble.where(id: unique_sets_data).find_each do |scramble_set|
      ActiveRecord::Base.transaction do
        set_identification = scramble_set.slice(:competition_id, :event_id, :group_id, :round_id, :round_type_id)
        puts "Migrating tuple #{set_identification}"

        scramble_scope = Scramble.where(**set_identification)
        upsert_data = scramble_scope.pluck(:scramble_num, :is_extra, :scramble)

        backfilled_set = Scramble.create!(
          **set_identification,
          is_extra: false,
          scramble: Scramble::BACKFILLING_SCRAMBLE,
          scramble_num: 0,
        )

        upsert_attributes = upsert_data
                            .map { %i[scramble_number is_extra scramble_string].zip(it).to_h }
                            .map { it.merge(scramble_set_id: backfilled_set.id) }

        IndividualScramble.upsert_all(upsert_attributes)

        scramble_scope.where.not(scramble: Scramble::BACKFILLING_SCRAMBLE).delete_all
      end
    end
  end
end
