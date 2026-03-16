# frozen_string_literal: true

class AddIndividualScramblesTable < ActiveRecord::Migration[8.1]
  def change
    rename_table :scrambles, :scramble_sets

    create_table :scrambles do |t|
      t.references :scramble_set, null: false, index: true, foreign_key: { on_delete: :cascade }
      t.integer :scramble_number, null: false
      t.boolean :is_extra, null: false, default: false
      t.text :scramble_string, null: false
      t.timestamps
      t.index %i[scramble_set_id scramble_number is_extra], unique: true
    end
  end
end
