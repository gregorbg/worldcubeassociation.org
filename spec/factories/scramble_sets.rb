# frozen_string_literal: true

FactoryBot.define do
  factory :scramble_set do
    transient do
      format_id { "a" }
    end

    event_id { "333" }
    round_type_id { "f" }
    group_id { "A" }
    competition { association(:competition, event_ids: [event_id]) }
    round { association(:round, competition: competition, event_id: event_id, format_id: format_id) }
  end
end
