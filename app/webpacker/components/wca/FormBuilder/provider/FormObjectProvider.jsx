import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import _ from 'lodash';
import { useForm, useStore } from '@tanstack/react-form';
import SectionProvider from './FormSectionProvider';

const FormContext = createContext(null);

export default function FormObjectProvider({
  children,
  initialObject,
  globalDisabled = false,
}) {
  const formApi = useForm({
    defaultValues: initialObject,
  });

  const formState = useStore(formApi.store, (state) => state.values);

  const unsavedChanges = useMemo(() => (
    !_.isEqual(initialObject, formState)
  ), [initialObject, formState]);

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

          formApi.setErrorMap(jsonSchemaError);
        }
      } else {
        formApi.setErrorMap(err.json);
      }
    } else {
      throw err;
    }
  }, [formApi]);

  const formContext = useMemo(() => ({
    formApi,
    unsavedChanges,
    onError,
  }), [formApi, onError, unsavedChanges]);

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
