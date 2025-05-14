# frozen_string_literal: true

class PreparedScrambleSet < ApplicationRecord
  belongs_to :competition
  belongs_to :event
  belongs_to :round_type

  belongs_to :scramble_file_upload, optional: true, foreign_key: "external_upload_id", inverse_of: :prepared_scramble_sets
  belongs_to :matched_round, class_name: "Round", optional: true

  has_many :scrambles, foreign_key: "scramble_set_id", class_name: "PreparedScramble", inverse_of: :scramble_set

  validates :ordered_index, uniqueness: { scope: %i[competition_id event_id round_type_id] }

  before_validation :backfill_round_information!, if: :matched_round_id?

  def backfill_round_information!
    return if matched_round.blank?

    self.competition_id = matched_round.competition_id
    self.event_id = matched_round.event_id
    self.round_type_id = matched_round.round_type_id
  end

  DEFAULT_SERIALIZE_OPTIONS = {
    include: %w[scrambles],
  }.freeze

  def serializable_hash(options = nil)
    super(DEFAULT_SERIALIZE_OPTIONS.merge(options || {}))
  end
end
