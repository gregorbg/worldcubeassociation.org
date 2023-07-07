# frozen_string_literal: true

# per https://github.com/sidekiq-cron/sidekiq-cron/issues/133
require "rake"
Rails.application.load_tasks

class ExecuteRakeTask < ApplicationJob
  queue_as :default

  # It is ugly to execute Rake tasks programmatically, but Railties doesn't give us any other choice
  # and hopefully the need for this task to even exist will go away reasonably soon :)
  def perform(args)
    Rake::Task[args["task"]].execute(args["args"])
  end
end
