import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { STATUS } from '../../constants/status';


/**
 * Displays a error message
 */
function DisplayError({
  error,
}): JSX.Element {
  const message = `Sorry, somthing went wrong. (${error})`;

  return (
    <MessageBar messageBarType={MessageBarType.error}>{message}</MessageBar>
  );
}

export default DisplayError;
