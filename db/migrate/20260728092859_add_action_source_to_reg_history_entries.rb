# frozen_string_literal: true

class AddActionSourceToRegHistoryEntries < ActiveRecord::Migration[8.1]
  def change
    add_column :registration_history_entries, :action_source, :string, after: :actor_id
  end
end
