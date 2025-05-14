# frozen_string_literal: true

class RenameInboxToPrepared < ActiveRecord::Migration[7.2]
  def change
    rename_table :inbox_scrambles, :prepared_scrambles
    rename_table :inbox_scramble_sets, :prepared_scramble_sets

    rename_column :prepared_scrambles, :inbox_scramble_set_id, :scramble_set_id
  end
end
