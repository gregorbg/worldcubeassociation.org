# frozen_string_literal: true

class AlterRecordsSpeedupIndex < ActiveRecord::Migration[8.1]
  def change
    change_table :results, bulk: true do |t|
      t.remove_index %i[event_id competition_id round_type_id country_id average]
      t.remove_index %i[event_id competition_id round_type_id country_id best]
      t.index %i[round_id country_id average], name: "index_results_crr_average_speedup"
      t.index %i[round_id country_id best], name: "index_results_crr_single_speedup"
    end
  end
end
