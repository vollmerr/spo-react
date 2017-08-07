import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Field } from 'redux-form';

import {
  ComboBox,
  IComboBoxOption,
} from 'office-ui-fabric-react/lib/ComboBox';

// TODO: MOVE COMMON
export const isEmptyText = value => (
  (typeof value !== 'string') ||
    value.match(/^\s*$/)
    ? 'Required'
    : undefined
);


/**
 * Select input for redux-form Field
 * Wraps office-ui's ComboBox
 *
 * https://dev.office.com/fabric#/components/ComboBox
 * https://github.com/OfficeDev/office-ui-fabric-react/blob/master/packages/office-ui-fabric-react/src/components/Checkbox/Checkbox.tsx
 */
// function InputSelect(props: InputSelectProps): JSX.Element {
//   const {
//     input,
//     meta,
//     label,
//     options,
//     disabled,
//     required,
//   } = props;

//   const { name, onChange, onBlur } = input;
//   const { touched, error } = meta;
//   const errorMessage = touched && error ? error : null;
//   const isRequired = required && !disabled;

//   const handleChange = (option: IComboBoxOption) => {
//     onChange(option.text);
//     onBlur();
//   }

//   const checkBoxProps = {
//     name,
//     label,
//     options,
//     disabled,
//     errorMessage,
//     ariaLabel: label,
//     autoComplete: 'on',
//     allowFreeform: false,
//     required: isRequired,
//     onChanged: handleChange,
//   };

//   return (
//     <ComboBox {...checkBoxProps} />
//   );
// }

class InputSelect extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  public handleChange = (option, index) => {
    this.setState({
      value: option.text,
    }, () => {
      const { onChange, onBlur } = this.props.input;
      if (this.props.onChange) {
        this.props.onChange(null, option.key);
      }

      onChange(option.key);
      onBlur();
    });
  }

  render() {
    const {
      meta,
      input,
      label,
      options,
      disabled,
      required,
      placeholder,
    } = this.props;

    const { value } = this.state;
    const { touched, error } = meta;

    const errorMessage = touched && error ? error : null;
    const isRequired = required && !disabled;

    const comboBoxProps = {
      name,
      label,
      options,
      disabled,
      placeholder,
      errorMessage,
      ariaLabel: label,
      autoComplete: 'on',
      allowFreeform: false,
      required: isRequired,
      selectedKey: input.value,
      onChanged: this.handleChange, // WATCH FOR API CHANGE (onChange)
    };

    return (
      <ComboBox {...comboBoxProps} />
    );
  }
}

interface InputSelectProps {
  input: any;
  meta: any;
  label: string;
  options: IComboBoxOption[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}


/**
 * Select Field for redux-form
 * Wraps redux-form's Field
 *
 * http://redux-form.com/7.0.3/docs/api/Field.md/
 */
function FieldSelect({
  name,
  label,
  options,
  required = false,
  disabled = false,
  validate = [],
  ...props,
}): JSX.Element {
  let toValidate = undefined;
  if (!disabled) {
    toValidate = [...validate];

    if (required) {
      toValidate.push(isEmptyText);
    }
  }

  const fieldProps = {
    name,
    label,
    options,
    required,
    disabled,
    validate: toValidate,
    component: InputSelect,
    ...props
  };

  return (
    <Field {...fieldProps} />
  );
}

export default FieldSelect;
