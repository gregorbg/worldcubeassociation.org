# frozen_string_literal: true

class ComputeLinkings < ApplicationJob
  def perform
    Relations.compute_linkings

    last_computation = Timestamp.find_or_create_by(name: 'linkings_computation')
    last_computation.touch :date
  end
end
