# frozen_string_literal: true

class Scramble < ApplicationRecord
  belongs_to :scramble_set

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

  def self.prefix_for_index(index)
    char = (65 + (index % 26)).chr
    return char if index < 26

    Scramble.prefix_for_index((index / 26) - 1) + char
  end
end
