import React, { useMemo } from 'react';

import { Form } from 'semantic-ui-react';
import useInputState from '../../lib/hooks/useInputState';
import WcaSearch from './WcaSearch';

function FormAdapter({
  railsId,
  railsName,
  railsValue,
  model,
  params,
  multiple = false,
  removeNoResultsMessage = false,
}) {
  const [selectedValue, setSelectedValue] = useInputState(multiple ? [] : undefined);

  const hiddenValue = useMemo(() => (multiple ? selectedValue.map((val) => val?.id).join(',') : selectedValue?.id), [selectedValue, multiple]);

  return (
    <Form.Field>
      <input hidden value={hiddenValue} id={railsId} name={railsName} />

      <WcaSearch
        model={model}
        params={params}
        value={selectedValue}
        onChange={setSelectedValue}
        name={railsName}
        multiple={multiple}
        removeNoResultsMessage={removeNoResultsMessage}
      />
    </Form.Field>
  );
}

export default FormAdapter;
