import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'demoStrings';
import App from './components/App';
import { IDemoWebPartProps } from './IDemoWebPartProps';

import configureStore from './store/configureStore';
import { Provider } from 'react-redux';

import 'office-ui-fabric-core/dist/css/fabric.min.css';


const store = configureStore();

export default class DemoWebPart extends BaseClientSideWebPart<IDemoWebPartProps> {
  constructor() {
    super();
    this.hideTitle();
  }

  public hideTitle() {
    const el = document.getElementsByClassName('pageHeader')[0] as any;
    if (el) {
      el.style.display = 'none';
    } else {
      console.error('CANNOT HIDE HEADER - check that there is a single .pageHeader header!');
    }
  }

  public render(): void {
    const appProps = {
      spHttpClient: this.context.spHttpClient,
      currentWebUrl: this.context.pageContext.web.serverRelativeUrl,
      id: this.properties.id
    };

    ReactDom.render(
      <Provider store={store}>
        <App {...appProps} />
      </Provider>,
      this.domElement,
    );
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('id', {
                  label: 'ID',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
