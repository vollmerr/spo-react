import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Field } from 'redux-form';

import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import style from './style.module.scss';
import FieldError from '../FieldError';

// TODO: MOVE COMMON
export const isEmptyRadio = value => (
  (typeof value !== 'string') ||
    value.match(/^\s*$/)
    ? 'Required'
    : undefined
);


/**
 * Radio input for redux-form Field
 * Wraps office-ui's ChoiceGroup
 *
 * https://dev.office.com/fabric#/components/choicegroup
 * https://github.com/OfficeDev/office-ui-fabric-react/blob/master/packages/office-ui-fabric-react/src/components/ChoiceGroup/ChoiceGroup.tsx
 */
// function InputRadio({
//   input,
//   meta,
//   label,
//   options,
//   disabled = false,
//   required = false,
// }): JSX.Element {
//   const { name, onChange, onBlur, onFocus } = input;
//   const { touched, error } = meta;
//   const errorMessage = touched && error ? error : null;
//   const isRequired = required && !disabled;

//   const handleChange = (event: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption) => {
//     onChange(option.key);
//   };

//   const choiceGroupProps = {
//     name,
//     label,
//     options,
//     disabled,
//     required: isRequired,
//     onChange: handleChange,
//   };

//   return (
//     <div>
//       <div className={errorMessage && style.invalid}>
//         <ChoiceGroup {...choiceGroupProps} />
//       </div>
//       <FieldError errorMessage={errorMessage} />
//     </div>
//   );
// }

class InputRadio extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: null,
    };
  }

  handleChange = (event, option) => {
    event.preventDefault();
    const { selectedKey } = this.state;

    let value;
    if (!option || option.key === selectedKey) {
      value = '';
    } else {
      value = option.key;
    }

    this.setState({
      selectedKey: value,
    }, () => {
      this.props.input.onChange(value);
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
    } = this.props;

    const { selectedKey } = this.state;
    const { touched, error } = meta;

    const errorMessage = touched && error ? error : null;
    const isRequired = required && !disabled;

    const choiceGroupProps = {
      name,
      label,
      options,
      disabled,
      selectedKey,
      required: isRequired,
      onChange: this.handleChange,
    };

    return (
      <div>
        <div className={errorMessage && style.invalid}>
          <ChoiceGroup {...choiceGroupProps} />
        </div>
        <FieldError errorMessage={errorMessage} />
      </div>
    );
  }
}

interface InputSelectProps {
  input: any;
  meta: any;
  label: string;
  options: IChoiceGroupOption[];
  disabled?: boolean;
  required?: boolean;
}


/**
 * Radio button Field for redux-form
 * Wraps redux-form's Field
 *
 * http://redux-form.com/7.0.3/docs/api/Field.md/
 */
function FieldRadio(props: FieldCheckboxProps): JSX.Element {
  const { required, disabled } = props;

  let toValidate = undefined;
  if (required && !disabled) {
    toValidate = [isEmptyRadio];
  }

  return (
    <Field component={InputRadio} validate={toValidate} {...props} />
  );
}

interface FieldCheckboxProps {
  name: string;
  label: string;
  options: IChoiceGroupOption[];
  disabled?: boolean;
  required?: boolean;
  validate?: ((val: string) => boolean | undefined)[];
}


export default FieldRadio;
