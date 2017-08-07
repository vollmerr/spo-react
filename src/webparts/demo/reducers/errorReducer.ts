import { Action } from '../actions/actionTypes';
import { Reducer } from 'redux';
import { ErrorState } from '../state/ErrorState';

export const actionTypeEndsInRequest = type => type.substring(type.length - 8) === '_REQUEST';
export const actionTypeEndsInSuccess = type => type.substring(type.length - 8) === '_SUCCESS';
export const actionTypeEndsInFailure = type => type.substring(type.length - 8) === '_FAILURE';

const initState = new ErrorState();

// Reducer determines how the state should change after every action.
const errorReducer: Reducer<ErrorState> = (state: ErrorState = initState, action: Action): ErrorState => {
  if (actionTypeEndsInRequest(action.type)) {
    return state.clearError();
  } else if (actionTypeEndsInFailure(action.type)) {
    return state.setError(action.payload);
  }

  return state;
};

export default errorReducer;
