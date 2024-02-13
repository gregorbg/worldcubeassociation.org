# frozen_string_literal: true

class UserIdsInput < SimpleForm::Inputs::Base
  def input(wrapper_options)
    merged_input_options = merge_wrapper_options(input_html_options, wrapper_options)
    hack_options = @builder.send(:objectify_options, merged_input_options)

    dummy = ActionView::Helpers::Tags::TextField.new(object_name, attribute_name, @builder.template, hack_options)
    dummy.send(:add_default_name_and_id, hack_options)

    model = @options[:persons_table] ? 'person' : 'user'
    param_options = @options.to_hash.symbolize_keys.slice(:only_staff_delegates, :only_trainee_delegates)

    @builder.template.react_component('SearchWidget/FormAdapter', {
      model: model,
      multiple: !@options[:only_one],
      notifyOnChange: @options[:notify_on_change].present?,
      railsId: hack_options['id'],
      railsName: hack_options['name'],
      railsValue: @builder.object.send(attribute_name),
      params: param_options,
    })

  end
end
