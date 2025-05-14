# frozen_string_literal: true

class CreateInboxScrambles < ActiveRecord::Migration[7.2]
  def change
    create_table :inbox_scrambles do |t|
      t.references :competition, type: :string, null: false
      t.references :event, type: :string, null: false, foreign_key: true, index: false
      t.references :round_type, type: :string, null: false, foreign_key: true, index: false
      t.string :group_id, null: false
      t.boolean :is_extra, null: false, default: false
      t.integer :scramble_number, null: false
      t.text :scramble_string, null: false
      t.timestamps
    end
  end
end
