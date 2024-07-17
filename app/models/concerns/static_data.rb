# frozen_string_literal: true

module StaticData
  extend ActiveSupport::Concern

  DATA_FOLDER = Rails.root.join('lib/static_data')

  class_methods do
    def parse_json_file(file_path, symbolize_names: true)
      ::JSON.parse(File.read(file_path), symbolize_names: symbolize_names)
    end

    def write_json_file(file_path, hash_data)
      json_output = ::JSON.pretty_generate(hash_data.as_json)

      # Don't rewrite the file if it already exists and has the same content.
      # It helps the asset pipeline or webpack understand that file wasn't changed.
      if File.exist?(file_path) && File.read(file_path) == json_output
        return
      end

      File.write(file_path, json_output)
    end
  end

  included do
    after_commit :write_json_data! if Rails.env.development?

    def self.data_file_handle
      self.name.pluralize.underscore
    end

    def self.static_json_data
      import_file = DATA_FOLDER.join("#{self.data_file_handle}.json")
      self.parse_json_file(import_file)
    end

    def self.all_raw
      self.static_json_data
    end

    def self.all_static
      self.all_raw.map do |attributes|
        column_attributes = attributes.slice(*self.column_names)
        self.new(**column_attributes)
      end
    end

    def self.dump_static
      self.all.as_json
    end

    def self.load_static
      self.upsert_all(self.all_raw)
    end

    def self.write_json_data!
      export_file = DATA_FOLDER.join("#{self.data_file_handle}.json")
      self.write_json_file(export_file, self.dump_static)
    end
  end
end
