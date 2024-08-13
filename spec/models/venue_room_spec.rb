# frozen_string_literal: true

require 'rails_helper'

RSpec.describe VenueRoom, type: :model do
  it "ensures all attributes are defined as either cloneable or uncloneable" do
    expect(VenueRoom.column_names).to match_array(VenueRoom::CLONEABLE_ATTRIBUTES + VenueRoom::UNCLONEABLE_ATTRIBUTES)
  end
end
