# frozen_string_literal: true

class IndividualScramble < ApplicationRecord
  self.table_name = "scrambles"

  belongs_to :scramble_set, class_name: "Scramble", inverse_of: :individual_scrambles

  alias_attribute :scramble_num, :scramble_number
  alias_attribute :scramble, :scramble_string

  delegate :competition_id, :event_id, :round_type_id, :round_id, :group_id, to: :scramble_set

  DEFAULT_SERIALIZE_OPTIONS = {
    only: %w[id is_extra],
    methods: %w[competition_id event_id round_type_id round_id group_id scramble_num scramble],
  }.freeze

  def serializable_hash(options = nil)
    super(DEFAULT_SERIALIZE_OPTIONS.merge(options || {}))
  end
end
