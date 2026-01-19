# frozen_string_literal: true

class AdditionalCrrIndices < ActiveRecord::Migration[8.1]
  def change
    change_table :results, bulk: true do |t|
      t.index %i[competition_id average]
      t.index %i[competition_id best]
    end
  end
end
