# frozen_string_literal: true

class RegistrationHistoryEntry < ApplicationRecord
  has_many :registration_history_changes, dependent: :destroy
  belongs_to :registration

  enum :action_source, {
    registration_form: 'registration-form',
    admin_ui: 'admin-ui',
    queue_worker: 'queue-worker',
    live_auto_accept: 'live-auto-accept',
    bulk_auto_accept: 'bulk-auto-accept',
    ots_form: 'ots-form',
    csv_import: 'csv-import',
  }, prefix: true
end
