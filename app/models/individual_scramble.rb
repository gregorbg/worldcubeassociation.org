# frozen_string_literal: true

class IndividualScramble < ApplicationRecord
  self.table_name = "scrambles"

  belongs_to :scramble
end
