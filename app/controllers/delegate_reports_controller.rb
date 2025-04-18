# frozen_string_literal: true

class DelegateReportsController < ApplicationController
  before_action :authenticate_user!

  private def competition_from_params
    if params[:competition_id]
      Competition.find(params[:competition_id])
    else
      DelegateReport.find(params[:id]).competition
    end
  end

  def show
    @competition = competition_from_params
    return if redirect_to_root_unless_user(:can_view_delegate_report?, @competition.delegate_report)

    @delegate_report = @competition.delegate_report
  end

  def edit
    @competition = competition_from_params
    return if redirect_to_root_unless_user(:can_edit_delegate_report?, @competition.delegate_report)

    @delegate_report = @competition.delegate_report
  end

  def update
    @competition = competition_from_params
    return if params[:delegate_report]&.dig(:posted) &&
              redirect_to_root_unless_user(:can_post_delegate_report?, @competition.delegate_report)

    return if redirect_to_root_unless_user(:can_edit_delegate_report?, @competition.delegate_report)

    @delegate_report = @competition.delegate_report
    @delegate_report.current_user = current_user
    was_previously_posted = @delegate_report.posted?

    @delegate_report.assign_attributes(delegate_report_params)
    is_posting = @delegate_report.posted? && !was_previously_posted
    assign_wrc_users @delegate_report if is_posting

    if @delegate_report.save
      flash[:success] = "Updated report"
      if is_posting
        # Don't email when posting old delegate reports.
        # See https://github.com/thewca/worldcubeassociation.org/issues/704 for details.
        if @competition.end_date >= DelegateReport::REPORTS_ENABLED_DATE
          CompetitionsMailer.notify_of_delegate_report_submission(@competition).deliver_later
          CompetitionsMailer.wrc_delegate_report_followup(@competition).deliver_later
          SendWrcReportNotification.perform_later(@competition)

          flash[:info] = "Your report has been posted and emailed!"
        else
          flash[:info] = "Your report has been posted but not emailed because it is for a pre June 2016 competition."
        end
        redirect_to delegate_report_path(@competition)
      else
        redirect_to delegate_report_edit_path(@competition)
      end
    else
      render :edit
    end
  end

  def delete_image
    image = ActiveStorage::Attachment.find(params[:image_id])
    image.purge

    flash[:success] = "Image deleted successfully."

    redirect_to delegate_report_edit_path(competition_from_params)
  end

  private def delegate_report_params
    params.require(:delegate_report).permit(
      :discussion_url,
      :schedule_url,
      :remarks,
      :posted,
      :wrc_feedback_requested,
      :wrc_incidents,
      :wic_feedback_requested,
      :wic_incidents,
      *DelegateReport::AVAILABLE_SECTIONS,
      setup_images: [],
    )
  end

  private def assign_wrc_users(delegate_report)
    wrc_primary_user, wrc_secondary_user = UserGroup.teams_committees_group_wrc.active_users.sample 2
    delegate_report.wrc_primary_user = wrc_primary_user
    delegate_report.wrc_secondary_user = wrc_secondary_user
  end
end
