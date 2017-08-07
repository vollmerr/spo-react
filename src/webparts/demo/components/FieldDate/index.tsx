import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Field } from 'redux-form';

import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings
} from 'office-ui-fabric-react/lib/DatePicker';

// TODO: MOVE COMMON
export const isInvalidDate = value => (
  !value
  ? 'Invalid Date, plase select from the date picker.'
  : undefined
);

const dayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',

  isRequiredErrorMessage: 'Required',

  invalidInputErrorMessage: 'Invalid date format.',
};


/**
 * Date input for redux-form Field
 * Wraps office-ui's DatePicker
 *
 * https://dev.office.com/fabric#/components/datepicker
 * https://github.com/OfficeDev/office-ui-fabric-react/blob/master/packages/office-ui-fabric-react/src/components/DatePicker/DatePicker.tsx
 *
 * TODO:
 *  - custom error messages (based off meta)
 *  - validate year greater then today
 */
class InputDate extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      strings: dayPickerStrings,
    };
  }

  componentDidMount() {
    const { input } = this.props;
    if (input.value) {
      this.handleChange(new Date(input.value));
    }
  }

  handleChange = (date) => {
    this.setState({
      value: date,
    }, () => {
      this.props.input.onChange(date);
    });
  }

  render() {
    const {
      input,
      label,
      disabled,
      required,
      placeholder,
    } = this.props;

    const { value, strings } = this.state;

    const isRequired = required && !disabled;

    const datePickerProps = {
      name,
      value,
      label,
      strings,
      disabled,
      isRequired,
      placeholder,
      onSelectDate: this.handleChange,
    };

    return (
      <DatePicker {...datePickerProps} />
    );
  }
}

interface InputDateProps {
  input: any;
  meta: any;
  label: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}


/**
 * Date Field for redux-form
 * Wraps redux-form's Field
 *
 * http://redux-form.com/7.0.3/docs/api/Field.md/
 */
function FieldDate(props: FieldDateProps): JSX.Element {
  const { required, disabled } = props;

  let toValidate = undefined;
  if (required && !disabled) {
    toValidate = [];
  }

  return (
    <Field component={InputDate} validate={toValidate} {...props} />
  );
}

interface FieldDateProps {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  validate?: ((val: string) => boolean | undefined)[];
}


export default FieldDate;
