# frozen_string_literal: true

class WcifPatchLog < ApplicationRecord
  belongs_to :competition
  belongs_to :user, optional: true
end
