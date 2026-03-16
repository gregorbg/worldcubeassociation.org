# frozen_string_literal: true

class IndividualScramble < ApplicationRecord
  self.table_name = "scrambles"

  belongs_to :scramble, foreign_key: "scramble_set_id", inverse_of: :individual_scrambles

  delegate :competition_id, :event_id, :round_type_id, :round_id, :group_id, to: :scramble

  DEFAULT_SERIALIZE_OPTIONS = {
    only: %w[id is_extra scramble_number scramble_string],
    methods: %w[competition_id event_id round_type_id round_id group_id],
  }.freeze

  def serializable_hash(options = nil)
    super(DEFAULT_SERIALIZE_OPTIONS.merge(options || {}))
  end
end
