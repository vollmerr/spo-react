import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import * as listActions from '../../actions/listActions';
import style from '../Wizard/style.module.scss';

import Fields from '../Fields';

import FieldSelect from '../FieldSelect';
import FieldText from '../FieldText';
import FieldDate from '../FieldDate';
import FieldRadio from '../FieldRadio';


const normalizeProjectNumber = (value, previousValue) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  if (!previousValue || value.length > previousValue.length) {
    if (onlyNums.length === 4) {
      return onlyNums + '-';
    }
  }

  if (onlyNums.length <= 4) {
    return onlyNums;
  }

  return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 7);
}


function mapStateToProps(state, ownProps) {
  return {};
}

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    ...listActions,
  }, dispatch),
});

const reduxFormProps = {
  form: 'test-form',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: false,
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
@(reduxForm(reduxFormProps))
class Section1_2 extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    };
  }


  public render() {
    const { submitting, invalid, dirty, handleSubmit, onSubmit, onPrev, agencyCodes } = this.props;
    const { fields } = this.state;

    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={'ms-Grid'}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12">
              <h1>1.2 PLACEHOLDER PAGE</h1>
            </div>
          </div>

          <div className={'ms-Grid-row'}>
            <div className="ms-Grid-col ms-sm12" style={{ margin: '100px 0' }}>
              This is a placeholder page to display and test the functionality of a wizard.
            </div>
          </div>

          <div className={`ms-Grid-row ${style.formButtons}`}>
            <div className="ms-Grid-col ms-sm12">
              <DefaultButton
                text={'Prev'}
                type={'button'}
                onClick={onPrev}
              />
              <PrimaryButton
                text={'Submit'}
                type={'submit'}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Section1_2;
