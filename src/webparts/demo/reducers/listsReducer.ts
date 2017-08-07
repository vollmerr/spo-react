import { Action, actionTypes } from '../actions/actionTypes';
import { Reducer } from 'redux';
import { ListState } from '../state/ListState';

const initState = new ListState();

// Reducer determines how the state should change after every action.
const listsReducer: Reducer<ListState> = (state: ListState = initState, action: Action): ListState => {

  switch (action.type) {
    case actionTypes.ADD_LIST_REQUEST:
      return state; // You can show a loading message here.
    case actionTypes.ADD_LIST_SUCCESS:
      return state.addList(action.payload);
    case actionTypes.ADD_LIST_FAILURE:
      return state;
    case actionTypes.GET_LISTS_REQUEST:
      return state;
    case actionTypes.GET_LISTS_SUCCESS:
      return state.setLists(action.payload);
    case actionTypes.GET_LISTS_FAILURE:
      return state; // .setMessage(action.payload); //You can show an error message here
    default: return state;
  }
};

export default listsReducer;
