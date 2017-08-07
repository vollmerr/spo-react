import { Reducer, combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import lists from './listsReducer';
import loading from './loadingReducer';
import error from './errorReducer';

import { RootState } from '../state';

// ALL reducers must got through this reducer
const rootReducer = combineReducers<RootState>({
  form,
  lists,
  error,
  loading,
});

export default rootReducer;
