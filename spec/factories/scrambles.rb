# frozen_string_literal: true

FactoryBot.define do
  factory :scramble do
    transient do
      format_id { "a" }
      event_id { "333" }
      round_type_id { "f" }
      group_id { "A" }
    end

    is_extra { false }
    scramble_num { 1 }
    scramble { "R2 D2" }
    scramble_set { association(:scramble_set, event_id: event_id, round_type_id: round_type_id, group_id: group_id, format_id: format_id) }
  end
end
