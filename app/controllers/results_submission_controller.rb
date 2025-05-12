# frozen_string_literal: true

require 'fileutils'

class ResultsSubmissionController < ApplicationController
  before_action :authenticate_user!
  before_action -> { redirect_to_root_unless_user(:can_upload_competition_results?, competition_from_params) }

  def new
    @competition = competition_from_params
    @results_validator = ResultsValidators::CompetitionsResultsValidator.create_full_validation
    @results_validator.validate(@competition.id)
  end

  def upload_json
    @competition = competition_from_params
    return redirect_to competition_submit_results_edit_path if @competition.results_submitted?

    # Do json analysis + insert record in db, then redirect to check inbox
    # (and delete existing record if any)
    upload_json_params = params.require(:upload_json).permit(:results_file)
    upload_json_params[:competition_id] = @competition.id
    @upload_json = UploadJson.new(upload_json_params)

    # This makes sure the json structure is valid!
    if @upload_json.import_to_inbox
      flash[:success] = "JSON File has been imported."
      @competition.uploaded_jsons.create(json_str: @upload_json.results_json_str)
      redirect_to competition_submit_results_edit_path
    else
      @results_validator = ResultsValidators::CompetitionsResultsValidator.create_full_validation
      @results_validator.validate(@competition.id)
      render :new
    end
  end

  def convert_xlsx
    @competition = competition_from_params

    uploaded_file = params.require(:workbook_assistant).require(:workbook)
    file_buffer = uploaded_file.read

    workbook = RubyXL::Parser.parse_buffer(file_buffer)

    base_wcif = {
      id: @competition.id,
      name: @competition.name,
      shortName: @competition.short_name,
      events: @competition.events_wcif,
      persons: [],
    }

    # This function strongly assumes that 'Registration' is the first sheet...
    parsed_wcif = workbook.worksheets.each_with_object(base_wcif) do |sheet, wcif|
      if sheet.sheet_name == "Registration"
        wcif_persons = sheet.sheet_data
                            .rows
                            .drop(3) # First row: Title. Second row: Checksums. Third row: Headers.
                            .map do |row|
          {
            registrantId: row[0].value.to_i,
            name: row[1].value,
            wcaUserId: nil,
            countryIso2: Country.c_find(row[2].value).iso2,
            wcaId: row[3].value.presence,
            gender: row[4].value,
            birthdate: row[5].value,
            # We actually don't need to fill this to post results.
            registration: {},
            email: nil,
            avatar: nil,
            roles: [],
            assignments: [],
            personalBests: [],
          }.stringify_keys
        end

        wcif["persons"] = wcif_persons
      else
        event_id = sheet.sheet_name.split('-').first

        event = wcif[:events].find { it["id"] == event_id }
        round = event["rounds"].find { it["id"] == sheet.sheet_name }

        # Some external services don't export the "nice" round ID and use roundTypeId instead
        if round.blank?
          round_type_id = sheet.sheet_name.split('-').last

          model_event = @competition.competition_events.find_by(event_id: event["id"])
          model_round = model_event.rounds.find { it.round_type_id == round_type_id }

          round = event["rounds"].find { it["id"] == model_round.wcif_id }
        end

        wcif_results = sheet.sheet_data
                            .rows
                            .drop(4)
                            .filter { it[1]&.value.present? }
                            .map do |row|
          {
            ranking: row[0].value.to_i,
            personId: person_from_result_row(row, wcif["persons"])["registrantId"],
            attempts: attempts_from_result_row(row, event["id"], round["format"]),
            best: best_for_row(row, event["id"], round["format"]),
            average: avg_for_row(row, event["id"], round["format"]),
          }
        end

        round["results"] = wcif_results
      end
    end

    render json: { success: true, wcif: parsed_wcif }
  end

  private def person_from_result_row(row, wcif_persons)
    wcif_persons.find do
      it["name"] == row[1].value &&
      it["countryIso2"] == Country.c_find(row[2].value).iso2 &&
      it["wcaId"].presence == row[3].value.presence
    end
  end

  private def attempts_from_result_row(row, event_id, format_id)
    model_format = Format.c_find(format_id)
    max_attempts = model_format.expected_solve_count

    if event_id == '333mbf'
      # For MBF, results start at index 7 with 4-column gaps between attempts
      return Array.new(max_attempts) do |index|
        { result: row[7 + (index * 4)].value.to_i }
      end
    end

    # For other events, results are stored consecutively starting at index 4
    attempts = row.cells[4, max_attempts]
                  .compact
                  .map { { result: time_to_value(it.value, event_id == '333fm') } }

    # Fill up to the expected number of attempts with result 0 if needed
    attempts << { result: 0 } while attempts.size < max_attempts

    attempts.map(&:stringify_keys)
  end

  private def best_for_row(row, event_id, format_id)
    model_format = Format.c_find(format_id)
    max_attempts = model_format.expected_solve_count

    if format_id == '1'
      # No "best" column for format 1
      return event_id == '333mbf' ? row[7].value.to_i : time_to_value(row[4].value, event_id == '333fm')
    end

    # Use extra offset for the "best" column
    offset = 4 + (if format_id == '1'
                    0
                  else
                    max_attempts * (event_id == '333mbf' ? 4 : 1)
                  end)
    value = row[offset].value

    event_id == '333mbf' ? value.to_i : time_to_value(value, event_id == '333fm')
  end

  def avg_for_row(row, event_id, format_id)
    return 0 if event_id == '333mbf'

    # Recognize averages for formats 3, m, or a
    return 0 unless %w[3 m a].include?(format_id)

    model_format = Format.c_find(format_id)
    max_attempts = model_format.expected_solve_count

    if format_id == 'a'
      # For average formats, take value from the corresponding position
      return time_to_value(row[7 + max_attempts])
    end

    # For other formats like '3' or 'm'
    avg_value = time_to_value(row[6 + max_attempts])

    if avg_value.nil? && %w[333bf 444bf 555bf].include?(event_id)
      attempts = attempts_from_result_row(event_id, format_id, row)

      raise "Can't compute mean, detected only #{attempts.size} attempts" unless attempts.size == 3

      avg_value = mean_from_attempts(attempts.pluck("result"))
    end

    avg_value || 0
  end

  private def time_to_value(value, is_fewest_moves = false)
    123
  end

  private def mean_from_attempts(attempt_values)
    attempt_values.sample
  end

  def create
    # Check inbox, create submission, send email
    @competition = competition_from_params

    submit_results_params = params.require(:results_submission).permit(:message, :schedule_url, :confirm_information)
    submit_results_params[:competition_id] = @competition.id
    @results_submission = ResultsSubmission.new(submit_results_params)
    # This validates also that results in Inboxes are all good
    if @results_submission.valid?
      CompetitionsMailer.results_submitted(@competition, @results_submission, current_user).deliver_now

      flash[:success] = "Thank you for submitting the results!"
      @competition.update!(results_submitted_at: Time.now)
      redirect_to competition_path(@competition)
    else
      flash[:danger] = "Submitted results contain errors."
      @results_validator = @results_submission.results_validator
      render :new
    end
  end

  private def competition_from_params
    Competition.find(params[:competition_id])
  end
end
