# frozen_string_literal: true

class Scramble < ApplicationRecord
  self.table_name = "scramble_sets"

  BACKFILLING_SCRAMBLE = '%%BACKFILL%%'

  belongs_to :competition
  belongs_to :round
  belongs_to :event
  belongs_to :round_type

  has_many :individual_scrambles, dependent: :destroy

  validates :group_id, format: { presence: true, with: /\A[A-Z]+\Z/, message: "Invalid scramble group name" }
  validates :scramble, presence: true
  validates :scramble_num, presence: true
  validates :scramble_num, numericality: { greater_than: 0, unless: :backfilled? }
  validates :is_extra, inclusion: { presence: true, in: [true, false] }

  delegate :competition_id, :round_type_id, :event_id, to: :round, prefix: true
  validates :competition_id, comparison: { equal_to: :round_competition_id }
  validates :round_type_id, comparison: { equal_to: :round_round_type_id }
  validates :event_id, comparison: { equal_to: :round_event_id }

  delegate :event, :round_type, to: :round

  def backfilled?
    self.scramble == BACKFILLING_SCRAMBLE && self.scramble_num.zero?
  end

  DEFAULT_SERIALIZE_OPTIONS = {
    only: %w[id competition_id event_id round_type_id round_id
             group_id is_extra scramble_num scramble],
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
