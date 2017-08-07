import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import * as listActions from '../../actions/listActions';
import { RootState } from '../../state';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import DisplayLoading from '../DisplayLoading';
import Section1_1 from '../Section1_1';
import Section1_2 from '../Section1_2';

// TODO...
interface IConnectedDispatch {
  actions: any;
}

interface IConnectedState {
  loading: any;
  initialValues: IListItems;
  formValues: IListItems;
}

function mapStateToProps(state: RootState, ownProps): IConnectedState {
  return {
    loading: state.loading,
    initialValues: state.lists.stage1[ownProps.id || '0'],
    formValues: getFormValues('test-form')(state) as IListItems,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): IConnectedDispatch => ({
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


@(connect(mapStateToProps, mapDispatchToProps) as any)
@(reduxForm(reduxFormProps))
class Wizard extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      listTitle: 'PPLA_STAGE_1', // S1BATabularWithColors
      isNewRequest: true,
      page: 1,
    };
  }


  public componentDidMount() {
    const { actions, spHttpClient, currentWebUrl } = this.props;

    this.getAllLists();
  }


  /**
   * Handles getting all lists for the given list
   */
  public getAllLists = () => {
    const { actions, spHttpClient, currentWebUrl } = this.props;
    const { listTitle } = this.state;

    actions.getLists(spHttpClient, currentWebUrl, listTitle, 'stage1');
  }


  /**
   * Handles clearing the form for a new request and initalizing state
   */
  public handleNewRequest = () => {
    const { destroy } = this.props;

    destroy();

    this.setState({
      listTitle: 'PPLA_STAGE_1',
      isNewRequest: true,
      page: 1,
    });
  }


  /**
   * Handles submitting a new request, passing in only values in fieldNames
   */
  public submitNew = () => {
    return new Promise<any>((resolve, reject) => {
      const { spHttpClient, currentWebUrl, formValues, listItemEntityTypeName } = this.props;
      const { listTitle } = this.state;
      const url = `${currentWebUrl}/_api/web/lists/getbytitle('${listTitle}')/items`;

      const filteredList = {};
      Object.keys(fieldNames).forEach((field) => {
        const key = fieldNames[field];
        filteredList[key] = formValues && formValues[key] || 'N/A';
      });

      const body: string = JSON.stringify({
        __metadata: {
          type: listItemEntityTypeName,
        },
        ...filteredList,
      });

      const config = {
        body,
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=verbose',
          'odata-version': '',
        },
      };

      resolve(spHttpClient.post(url, SPHttpClient.configurations.v1, config));
    });
  }


  /**
   * Handles submitting a new request, either generating new or replacing existing request
   * @prop {object} vals  - values of entire form
   */
  public handleSubmit = (vals: IListItems) => {
    const { getListItemEntityTypeName } = this.props;
    const { isNewRequest } = this.state;

    getListItemEntityTypeName()
      .then(() => isNewRequest ? this.submitNew() : this.submitUpdate())
      .then(() => this.handleNewRequest());
  }


  /**
   * Handles submitting an existing request with new values
   * Updates based off fecthed etag to ensure correct item
   */
  public submitUpdate = (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      const { spHttpClient, currentWebUrl, formValues, getEtag, listItemEntityTypeName } = this.props;
      const { listTitle } = this.state;
      const url = `${currentWebUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${formValues.Id})`;

      const filteredList = {};
      Object.keys(fieldNames).forEach((field) => {
        const key = fieldNames[field];
        filteredList[key] = formValues[key] || 'N/A';

        if (typeof filteredList[key] === 'number') {
          filteredList[key] = filteredList[key].toFixed(15)
        }
      });

      const body: string = JSON.stringify({
        __metadata: {
          type: listItemEntityTypeName,
        },
        ...filteredList,
      });

      getEtag()
        .then((etag) => {
          const config = {
            body,
            headers: {
              Accept: 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=verbose',
              'odata-version': '',
              'IF-MATCH': etag,
              'X-HTTP-Method': 'MERGE',
            },
          };

          resolve(spHttpClient.post(url, SPHttpClient.configurations.v1, config));
        })
        .catch(err => reject(err));
    });
  }


  /**
   * Handles going to the next page in the wizard
   */
  public handlePrevPage = () => {
    this.setState({
      page: this.state.page - 1,
    });
  }


  /**
   * Handles going to the previous page in the wizard
   */
  public handleNextPage = () => {
    this.setState({
      page: this.state.page + 1,
    });
  }


  public render() {
    const { handleSubmit, agencies, agencyCodes, loading } = this.props;
    const { page } = this.state;

    const TESTBUTTONS = () => (
      <div className={'ms-Grid'}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm">
            <DefaultButton
              text={'Load'}
              onClick={this.getAllLists}
            />

            <DefaultButton
              text={'New'}
              onClick={this.handleNewRequest}
            />
          </div>
        </div>
      </div>
    );

    const section1Props = {
      agencies,
      agencyCodes,
      onSubmit: this.handleNextPage,
    };

    const section2Props = {
      agencies,
      agencyCodes,
      onPrev: this.handlePrevPage,
      onSubmit: this.handleSubmit,
    };

    if (loading) {
      return <DisplayLoading />;
    }

    return (
      <div>
        {page === 1 && <Section1_1 {...section1Props} />}
        {page === 2 && <Section1_2 {...section2Props} />}
      </div>
    );
  }
}

export default Wizard;
