# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CompetitionVenue, type: :model do
  it "ensures all attributes are defined as either cloneable or uncloneable" do
    expect(CompetitionVenue.column_names).to match_array(CompetitionVenue::CLONEABLE_ATTRIBUTES + CompetitionVenue::UNCLONEABLE_ATTRIBUTES)
  end
end
