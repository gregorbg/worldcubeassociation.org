# frozen_string_literal: true

class InboxScramble < ApplicationRecord
  belongs_to :competition
  belongs_to :event
  belongs_to :round_type

  validates :group_id, format: { presence: true, with: /\A[A-Z]+\Z/, message: "Invalid scramble group name" }
  validates :scramble_string, presence: true
  validates :scramble_number, numericality: { presence: true, greater_than: 0 }
  validates :is_extra, inclusion: { presence: true, in: [true, false] }

  alias_attribute :scramble_num, :scramble_number
  alias_attribute :scramble, :scramble_string

  def event
    Event.c_find(event_id)
  end

  def round_type
    RoundType.c_find(round_type_id)
  end

  DEFAULT_SERIALIZE_OPTIONS = {
    only: %w[id competition_id event_id round_type_id group_id
             is_extra scramble_num scramble],
  }.freeze

  def serializable_hash(options = nil)
    super(DEFAULT_SERIALIZE_OPTIONS.merge(options || {}))
  end
end
