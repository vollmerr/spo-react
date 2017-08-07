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


const fieldNames = {
  orgName: 'd6uv',
  orgCode: 'ajnn',
  proposalName: 'a60a',
  proposalStartDate: 'ifdo',
  proposalDesc: 'k0lu',
  delegationCostThreshold: 'Dele_x0020_Cost_x0020_Threshold',
  projectNumber: 'ptxy',
  // hidden fields
  agencyName: 'mmeu',
  agencyCode: 'ue7d',
};


const initalFields = {
  orgName: {
    name: fieldNames.orgName,
    label: 'Agency or State Entity Name',
    placeholder: 'Select the Agency or State Entity Name',
    required: true,
    disabled: false,
  },
  orgCode: {
    name: fieldNames.orgCode,
    label: 'Org Code',
    required: true,
    disabled: true,
  },
  proposalName: {
    name: fieldNames.proposalName,
    label: 'Proposal Name',
    placeholder: 'Enter the Proposal Name',
    required: true,
    disabled: false,
  },
  proposalStartDate: {
    name: fieldNames.proposalStartDate,
    label: 'Proposed Start Date',
    placeholder: 'Select the Proposed Start Date',
    required: true,
    disabled: false,
  },
  proposalDesc: {
    name: fieldNames.proposalDesc,
    label: 'Proposal Description',
    placeholder: 'Enter the Proposal Description',
    required: true,
    disabled: false,
  },
  delegationCostThreshold: {
    name: fieldNames.delegationCostThreshold,
    label: 'Delegated Cost Threshold',
    required: false,
    disabled: false,
  },
  projectNumber: {
    name: fieldNames.projectNumber,
    label: 'Department of Technology Project Number',
    placeholder: 'XXXX-XXX',
    required: false,
    disabled: false,
  },
}


@(connect(mapStateToProps, mapDispatchToProps) as any)
@(reduxForm(reduxFormProps))
class Section1_1 extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      fields: initalFields,
    };
  }

  /**
   * Handles Agency Name changing
   * Updates OrgCode based off selection
   */
  public handleAgencyOnChange = (e, value) => {
    const { change, agencies } = this.props;

    change(fieldNames.orgCode, agencies[value].orgCode);
    change(fieldNames.agencyName, agencies[value].agencyName);
    change(fieldNames.agencyCode, agencies[value].agencyCode);
  }


  public render() {
    const { submitting, invalid, dirty, handleSubmit, onSubmit, agencyCodes } = this.props;
    const { fields } = this.state;

    // TODO: MOVE COMMON
    // Validation
    const isEmptyText = value => (
      (typeof value !== 'string') ||
        value.match(/^\s*$/)
        ? 'Required'
        : undefined
    );

    // const isValidProjectNumber = value => (
    //   !value && value.match(/\d\d\d\d-\d\d\d/)
    //     ? 'Invalid Project Number. Must be in numeric XXXX-XXX format.'
    //     : undefined
    // );

    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={'ms-Grid'}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12">
              <h1>1.1 General Information</h1>
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-lg7">
              <FieldSelect
                options={agencyCodes}
                onChange={this.handleAgencyOnChange}
                {...fields.orgName}
              />
            </div>

            <div className="ms-Grid-col ms-sm12 ms-lg5">
              <FieldText {...fields.orgCode} />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-lg7">
              <FieldText {...fields.proposalName} />
            </div>

            <div className="ms-Grid-col ms-sm12 ms-lg5">
              <FieldDate {...fields.proposalStartDate} />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12">
              <FieldText
                multiline
                autoAdjustHeight
                {...fields.proposalDesc}
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-lg7">
              <FieldSelect
                options={
                  [
                    { key: 'N/A', text: 'Does Not Apply' },
                    { key: 'Under', text: 'Under' },
                    { key: 'Over', text: 'Over' },
                  ]
                }
                {...fields.delegationCostThreshold}
              />
            </div>
            <div className="ms-Grid-col ms-sm12 ms-lg5">
              <FieldText
                normalize={normalizeProjectNumber}
                {...fields.projectNumber}
              />
            </div>
          </div>

          <div className={`ms-Grid-row ${style.formButtons}`}>
            <div className="ms-Grid-col ms-sm12">
              <PrimaryButton
                text={'Next'}
                type={'submit'}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Section1_1;
