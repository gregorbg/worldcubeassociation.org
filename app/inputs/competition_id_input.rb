# frozen_string_literal: true

class CompetitionIdInput < SimpleForm::Inputs::Base
  def input(wrapper_options)
    merged_input_options = merge_wrapper_options(input_html_options, wrapper_options)
    hack_options = @builder.send(:objectify_options, merged_input_options)

    dummy = ActionView::Helpers::Tags::TextField.new(object_name, attribute_name, @builder.template, hack_options)
    dummy.send(:add_default_name_and_id, hack_options)

    @builder.template.react_component('SearchWidget/FormAdapter', {
      model: 'competition',
      multiple: !@options[:only_one],
      railsId: hack_options['id'],
      railsName: hack_options['name'],
      railsValue: @builder.object.send(attribute_name),
    })
  end
end
