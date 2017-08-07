import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Field } from 'redux-form';

import { TextField } from 'office-ui-fabric-react/lib/TextField';

// TODO: MOVE COMMON
export const isEmptyText = value => (
  (typeof value !== 'string') ||
    value.match(/^\s*$/)
    ? 'Required'
    : undefined
);


/**
 * Text input for redux-form Field
 * Wraps office-ui's TextField
 *
 * https://dev.office.com/fabric#/components/textfield
 * https://github.com/OfficeDev/office-ui-fabric-react/blob/master/packages/office-ui-fabric-react/src/components/TextField/TextField.tsx
 */
function InputText(props: InputTextProps): JSX.Element {
  const {
    input,
    meta,
    label,
    disabled,
    required,
    validate,
    multiline,
    placeholder,
    autoAdjustHeight,
  } = props;

  const { onChange, onBlur, onFocus, name, value } = input;
  const { touched, error } = meta;

  const errorMessage = touched && error ? error : '';

  const isRequired = required && !disabled;

  const textFieldProps = {
    name,
    label,
    value,
    onBlur,
    onFocus,
    disabled,
    multiline,
    placeholder,
    errorMessage,
    autoAdjustHeight,
    onChanged: onChange,
    required: isRequired,
    'aria-describedby': name,
    ...input,
  };

  return (
    <TextField {...textFieldProps} />
  );
}

interface InputTextProps {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  input: any;
  meta: any;
  validate: any;
  placeholder?: string;
  autoAdjustHeight?: boolean;
  multiline?: boolean;
}


/**
 * Text field for redux-form
 * Wraps redux-form's Field
 *
 * http://redux-form.com/7.0.3/docs/api/Field.md/
 */
function FieldText({
  name,
  label,
  required = false,
  disabled = false,
  validate = [] as any,
  ...props,
}): JSX.Element {
  let toValidate = [];
  if (!disabled) {
    toValidate = [...validate];

    if (required) {
      toValidate.push(isEmptyText);
    }
  }

  const fieldProps = {
    name,
    label,
    required,
    disabled,
    validate: toValidate,
    component: InputText,
    ...props,
  };

  return (
    <Field {...fieldProps} />
  );
}

export default FieldText;
