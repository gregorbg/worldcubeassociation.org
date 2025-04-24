# frozen_string_literal: true

source 'https://rubygems.org'

gem 'activerecord-import'
gem 'activestorage-validator'
gem 'after_commit_everywhere'
gem 'api-pagination'
gem 'aws-sdk-cloudfront'
gem 'aws-sdk-rds'
gem 'aws-sdk-s3'
gem 'aws-sdk-sqs'
gem 'blocks'
gem 'bootstrap-sass'
gem 'bootstrap-table-rails'
gem 'cocoon'
gem 'cookies_eu'
gem 'csv'
gem 'daemons'
gem 'datetimepicker-rails', github: 'zpaulovics/datetimepicker-rails', submodules: true
gem 'devise'
# NOTE: we put devise-18n before devise-bootstrap-views intentionally.
# See https://github.com/hisea/devise-bootstrap-views/issues/55 for more details.
gem 'devise-i18n'
gem 'devise-bootstrap-views' # rubocop:disable Bundler/OrderedGems
gem 'devise-jwt'
gem 'devise-two-factor'
gem 'doorkeeper'
gem 'doorkeeper-i18n'
gem 'doorkeeper-openid_connect'
gem 'dotenv-rails', require: 'dotenv/load'
gem 'enum_help'
gem 'eu_central_bank'
gem 'faraday'
gem 'faraday-retry'
gem 'google-apis-admin_directory_v1'
gem 'hash_diff'
# Faster Redis library
gem 'hiredis'
gem 'http_accept_language'
gem 'i18n-country-translations', github: 'thewca/i18n-country-translations'
gem 'i18n-js'
gem 'icalendar'
gem 'image_processing'
gem 'iso', github: 'thewca/ruby-iso'
gem 'jaro_winkler'
gem 'jbuilder'
gem 'json-schema'
gem 'jwt'
gem 'kaminari'
gem 'kaminari-i18n'
gem 'mail_form'
gem 'mini_magick'
gem 'momentjs-rails', github: 'derekprior/momentjs-rails'
gem 'money-currencylayer-bank'
gem 'money-rails'
gem 'mysql2'
gem 'nokogiri'
gem 'oauth2'
gem 'octokit'
gem 'openssl'
gem 'playwright-ruby-client', require: 'playwright'
gem 'premailer-rails'
gem 'puma'
gem 'rack-cors', require: 'rack/cors'
gem 'rails'
gem 'rails-i18n'
gem 'react-rails'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'redcarpet'
gem 'redis'
gem 'rest-client'
gem 'rqrcode'
# Some of our very old Sprockets asset code relies on gem-bundled Bootstrap 3 (grrr...)
#   which uses SCSS features incompatible with Dart SASS 2.
gem 'sassc-embedded', '~> 1'
gem 'sass-rails'
gem 'sdoc', group: :doc
gem 'seedbank'
# Pointing to jfly/selectize-rails which has a workaround for
#  https://github.com/selectize/selectize.js/issues/953
gem 'selectize-rails', github: 'jfly/selectize-rails'
# version explicitly specified because Shakapacker wants to keep Gemfile and package.json in sync
gem 'shakapacker', '8.2.0'
gem 'sidekiq'
gem 'sidekiq-cron'
gem 'simple_form'
gem 'slack-ruby-client'
gem 'sprockets-rails'
# pointing to our fork which has Rails 7 support enabled (aka monkey-patched)
gem 'starburst', github: 'thewca/starburst'
gem 'strip_attributes'
gem 'stripe'
gem 'superconfig'
gem 'terser'
gem 'time_will_tell', github: 'thewca/time_will_tell'
gem 'translighterate'
gem 'twitter_cldr'
gem 'tzf'
gem 'valid_email'
gem 'vault'
gem 'wca_i18n'

group :development, :test do
  gem 'byebug'
  gem 'capybara-screenshot'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'i18n-spec'
  gem 'i18n-tasks'
  gem 'rspec-rails'
  gem 'spring'
  gem 'spring-commands-rspec'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'bullet'
  gem 'overcommit', require: false
  gem 'rubocop', require: false
  gem 'rubocop-capybara', require: false
  gem 'rubocop-factory_bot', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rake', require: false
  gem 'rubocop-rspec', require: false
  gem 'rubocop-rspec_rails', require: false
  gem 'rubocop-thread_safety', require: false
  gem 'web-console'
end

group :test do
  gem 'capybara'
  gem 'capybara-playwright-driver'
  gem 'database_cleaner'
  gem 'guard-rspec'
  gem 'launchy'
  gem 'oga' # XML parsing library introduced for testing RSS feed
  gem 'rails-controller-testing'
  gem 'rake'
  gem 'rspec-retry'
  gem 'simplecov', require: false
  gem 'simplecov-lcov', require: false
  gem 'timecop'
  gem 'webmock'
end

group :production do
  gem 'newrelic_rpm'
  gem 'rack'
  gem 'shoryuken'
end
