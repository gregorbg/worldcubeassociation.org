import React, {
  createContext,
  useCallback,
  useContext,
  useMemo, useState,
} from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import SectionProvider from './FormSectionProvider';

const FormContext = createContext(null);

export default function FormObjectProvider({
  children,
  initialObject,
  globalDisabled = false,
}) {
  const [persistedObject, setPersistedObject] = useState(initialObject);

  const formApi = useForm({
    defaultValues: persistedObject,
    onSubmit: ({ value }) => setPersistedObject(value),
  });

  const setFormError = useCallback((errorObj) => {
    formApi.setErrorMap({ onSubmit: errorObj });
  }, [formApi]);

  const onError = useCallback((err) => {
    // check whether the 'json' and 'response' properties are set,
    // which means it's (very probably) a FetchJsonError
    if (err.json !== undefined && err.response !== undefined) {
      // The 'error' property means we pasted a generic error message in the backend.
      if (err.json.error !== undefined) {
        // json schema errors have only one error message, but our frontend supports
        // an arbitrary number of messages per property. So we wrap it in an array.
        if (err.response.status === 422 && err.json.schema !== undefined) {
          const jsonSchemaError = {
            [err.json.jsonProperty]: [
              `Did not match the expected format: ${JSON.stringify(err.json.schema)}`,
            ],
          };

          setFormError(jsonSchemaError);
        }
      } else {
        setFormError(err.json);
      }
    } else {
      throw err;
    }
  }, [setFormError]);

  const formContext = useMemo(() => ({
    formApi,
    persistedObject,
    onSuccess: formApi.handleSubmit,
    onError,
  }), [formApi, persistedObject, onError]);

  return (
    <FormContext.Provider value={formContext}>
      <SectionProvider disabled={globalDisabled}>
        {children}
      </SectionProvider>
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext);

export const useFormObject = () => useStore(
  useFormContext().formApi.store,
  (state) => state.values,
);

export const useFormErrorHandler = () => useFormContext().onError;

export const useFormUpdateAction = () => {
  const formApi = useFormContext();

  return useCallback((key, value) => (
    formApi.setFieldValue(key, value)
  ), [formApi]);
};
