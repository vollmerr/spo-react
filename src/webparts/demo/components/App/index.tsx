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
import { STATUS } from '../../constants/status';

import DisplayError from '../DisplayError';
import DisplayLoading from '../DisplayLoading';
import Fields from '../Fields';

import Wizard from '../Wizard';

function mapStateToProps(state: RootState, ownProps) {
  return {
    error: state.error,
    agencyCodes: state.lists.agencyCodes,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  actions: bindActionCreators({
    ...listActions,
  }, dispatch),
});


@(connect(mapStateToProps, mapDispatchToProps) as any)
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      agencyCodes: [],
      agencies: {},
    };
  }


  public componentDidMount() {
    this.getOrgCodes();
  }


  /**
   * API function for getting organization and agency codes and names
   * TODO: belong here or in wizard? (see if used throughout app...)
   */
  public getOrgCodes = () => {
    const { actions, spHttpClient, currentWebUrl } = this.props;

    return new Promise((resolve, reject) => {
      actions.getLists(spHttpClient, currentWebUrl, 'Organization Codes', 'agencyCodes')
        .then(() => {
          const { agencyCodes } = this.props;
          const agencies = {};
          agencyCodes.forEach((item) => {
            agencies[item.Title] = {
              agencyCode: item.AgencyCode,
              agencyName: item.AgencyName,
              orgCode: item.OrgCode,
              orgName: item.Title,
            };
          });

          this.setState({
            agencies,
            agencyCodes: agencyCodes.map(item => ({ key: item.Title, text: item.Title })),
          });
          resolve();
        })
        .catch(err => reject(err));
    });
  }


  /**
   * API function for getting the etag of an item.
   */
  public getEtag = (): Promise<any> => {
    return new Promise<any>((resolve, reject): void => {
      const { spHttpClient, currentWebUrl, formValues } = this.props;
      const { listTitle } = this.state;
      const url = `${currentWebUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${formValues.Id})?$select=Id`;
      const config = {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'odata-version': '',
        },
      };

      return spHttpClient.get(url, SPHttpClient.configurations.v1, config)
        .then((response: SPHttpClientResponse) => {
          resolve(response.headers.get('ETag'));
        })
        .catch(error => reject(error));
    });
  }


  /**
   * API function for getting the list item's entity type
   */
  public getListItemEntityTypeName = (): Promise<any> => {
    return new Promise<any>((resolve, reject): void => {
      const { spHttpClient, currentWebUrl } = this.props;
      const { listTitle, listItemEntityTypeName } = this.state;
      const url = `${currentWebUrl}/_api/web/lists/getbytitle('${listTitle}')?$select=ListItemEntityTypeFullName`;
      const config = {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'odata-version': '',
        }
      };

      if (listItemEntityTypeName) {
        return resolve();
      }

      spHttpClient.get(url, SPHttpClient.configurations.v1, config)
        .then((response: SPHttpClientResponse): Promise<any> => {
          return response.json();
        })
        .then((response): void => {
          this.setState({
            listItemEntityTypeName: response.ListItemEntityTypeFullName
          });

          return resolve();
        })
        .catch(error => reject(error));
    });
  }


  public render() {
    const { id, spHttpClient, currentWebUrl, error } = this.props;
    const { agencies, agencyCodes, errorMessage } = this.state;

    const api = {
      spHttpClient,
      currentWebUrl,
      getEtag: this.getEtag,
      getListItemEntityTypeName: this.getListItemEntityTypeName,
    };

    const wizardProps = {
      id,
      agencies,
      agencyCodes,
      ...api,
    };

    const component = error ?
      <DisplayError error={error} /> :
      <Wizard {...wizardProps} />;

    return (
      <Fabric>

        <p>wizard container stuff...</p>

        {component}

      </Fabric>
    );
  }
}

export default App;
