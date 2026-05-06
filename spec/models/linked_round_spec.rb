# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LinkedRound do
  context "final_round?" do
    let(:competition) { create(:competition) }
    let(:linked_round) { create(:linked_round) }

    it "returns true for Dual Rounds with round 1 + 2 of 2" do
      create(:round, event_id: "333", competition: competition, linked_round: linked_round, total_number_of_rounds: 2, number: 1)
      create(:round, event_id: "333", competition: competition, linked_round: linked_round, total_number_of_rounds: 2, number: 2)

      expect(linked_round).to be_final_round
    end

    it "returns false for Dual Rounds with round 1 + 2 of 3" do
      create(:round, event_id: "333", competition: competition, linked_round: linked_round, total_number_of_rounds: 3, number: 1)
      create(:round, event_id: "333", competition: competition, linked_round: linked_round, total_number_of_rounds: 3, number: 2)

      expect(linked_round).not_to be_final_round
    end
  end
end
