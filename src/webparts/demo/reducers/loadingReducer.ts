import { Action } from '../actions/actionTypes';
import { Reducer } from 'redux';
import { LoadingState } from '../state/LoadingState';

export const actionTypeEndsInRequest = type => type.substring(type.length - 8) === '_REQUEST';
export const actionTypeEndsInSuccess = type => type.substring(type.length - 8) === '_SUCCESS';
export const actionTypeEndsInFailure = type => type.substring(type.length - 8) === '_FAILURE';

const initState = new LoadingState();

// Reducer determines how the state should change after every action.
const loadingReducer: Reducer<LoadingState> = (state: LoadingState = initState, action: Action): LoadingState => {
  if (actionTypeEndsInRequest(action.type)) {
    return state.increaseLoading();
  } else if (actionTypeEndsInSuccess(action.type)) {
    return state.decreaseLoading();
  } else if (actionTypeEndsInFailure(action.type)) {
    return state.decreaseLoading();
  }

  return state;
};

export default loadingReducer;
