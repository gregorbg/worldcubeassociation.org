# frozen_string_literal: true

namespace :scramble_sets do
  desc "Backfill old redundant data into new scramble_sets table"
  task backfill_sets_data: :environment do
    ActiveRecord::Base.execute <<~SQL.squish
      INSERT INTO scrambles (scramble_set_id, scramble_number, is_extra, scramble_string, created_at, updated_at)
      WITH parent_set AS (
        SELECT round_id, group_id, MIN(id) AS min_id
        FROM scramble_sets
        GROUP BY round_id, group_id
      )
      SELECT
        parent_set.min_id AS scramble_set_id,
        scramble_sets.scramble_num AS scramble_number,
        scramble_sets.is_extra,
        scramble_sets.scramble AS scramble_string,
        CURRENT_TIMESTAMP() AS created_at,
        CURRENT_TIMESTAMP() AS updated_at
      FROM scramble_sets
      LEFT JOIN parent_set
        ON scramble_sets.round_id = parent_set.round_id
          AND scramble_sets.group_id = parent_set.group_id
      ON DUPLICATE KEY UPDATE
        scramble_set_id = VALUES(scramble_set_id),
        scramble_number = VALUES(scramble_number),
        is_extra = VALUES(is_extra),
        scramble_string = VALUES(scramble_string),
        updated_at = CURRENT_TIMESTAMP();
    SQL
  end
end
