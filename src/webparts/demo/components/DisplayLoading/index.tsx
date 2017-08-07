import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import style from './style.module.scss';

/**
 * Displays a loading indicator
 */
function DisplayLoading(): JSX.Element {
  return (
    <div className={style.loading}>
      <Spinner size={SpinnerSize.large} label={'Loading...'} />
    </div>
  );
}

export default DisplayLoading;
