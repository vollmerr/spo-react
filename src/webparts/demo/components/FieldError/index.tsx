import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DelayedRender, css } from 'office-ui-fabric-react/lib/Utilities';
import * as textStyles from 'office-ui-fabric-react/lib/components/TextField/TextField.scss';
import { AnimationClassNames } from '@uifabric/styling/lib/index';


/**
 * Error message for input fields. Why is there not one...
 * https://github.com/OfficeDev/office-ui-fabric-react/blob/master/packages/office-ui-fabric-react/src/components/TextField/TextField.tsx
 */
function FieldError({
  errorMessage = null,
}) {
  if (errorMessage) {
    return (
      <div aria-live={'assertive'}>
        <DelayedRender>
          <p
            className={css('ms-TextField-errorMessage', AnimationClassNames.slideDownIn20, textStyles.errorMessage)}
          >
            {Icon({ iconName: 'Error', className: textStyles.errorIcon })}
            <span data-automation-id={'error-message'}>{errorMessage}</span>
          </p>
        </DelayedRender>
      </div>
    );
  }

  return null;
}

export default FieldError;
