# frozen_string_literal: true

class AddWcifPatchLogsTable < ActiveRecord::Migration[8.1]
  def change
    create_table :wcif_patch_logs do |t|
      t.references :competition, null: false, type: :string
      t.references :oauth_application, type: :integer
      t.references :user
      t.json :payload, null: false
      t.string :exception_type
      t.text :exception_message
      t.integer :exception_status
      t.integer :response_status
      t.timestamps
    end
  end
end
