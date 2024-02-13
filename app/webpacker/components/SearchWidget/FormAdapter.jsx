import React, { useEffect, useMemo } from 'react';

import { Form } from 'semantic-ui-react';
import useInputState from '../../lib/hooks/useInputState';
import { IdWcaSearch } from './WcaSearch';

function FormAdapter({
  railsId,
  railsName,
  railsValue,
  model,
  params,
  multiple = false,
  notifyOnChange = false,
  removeNoResultsMessage = true,
  goToItemUrlOnClick = false,
}) {
  const [selectedValue, setSelectedValue] = useInputState(multiple ? (railsValue?.split(',') || []) : railsValue);

  const hiddenValue = useMemo(() => (multiple ? selectedValue.join(',') : selectedValue), [selectedValue, multiple]);

  useEffect(() => {
    if (notifyOnChange) {
      console.log('sending notification', railsId);
      $(`#${railsId}`).change();
    }
  }, [notifyOnChange, railsId, selectedValue]);

  return (
    <Form.Field>
      <input hidden readOnly value={hiddenValue || ''} id={railsId} name={railsName} />

      <IdWcaSearch
        model={model}
        params={params}
        value={selectedValue}
        onChange={setSelectedValue}
        name={railsName}
        multiple={multiple}
        removeNoResultsMessage={removeNoResultsMessage}
        goToItemUrlOnClick={goToItemUrlOnClick}
      />
    </Form.Field>
  );
}

export default FormAdapter;
