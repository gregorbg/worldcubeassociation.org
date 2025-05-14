# frozen_string_literal: true

class PreparedScramble < ApplicationRecord
  default_scope { order(:is_extra, :scramble_number) }

  belongs_to :scramble_set, class_name: "PreparedScrambleSet"

  validates :scramble_number, uniqueness: { scope: %i[is_extra scramble_set_id] }
end
