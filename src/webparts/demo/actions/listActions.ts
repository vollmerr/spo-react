import { actionTypes, Action } from './actionTypes';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';


const addListRequest = (): Action => ({
  type: actionTypes.ADD_LIST_REQUEST
});
const addListSuccess = (list: string): Action => ({
  type: actionTypes.ADD_LIST_SUCCESS,
  payload: list
});
const addListError = (error: Error): Action => ({
  type: actionTypes.ADD_LIST_FAILURE,
  payload: error.message
});


const getListsRequest = (): Action => ({
  type: actionTypes.GET_LISTS_REQUEST
});
const getListsSuccess = (title: string, lists: IListItems[]): Action => ({
  type: actionTypes.GET_LISTS_SUCCESS,
  payload: { title, lists }
});
const getListsError = (error: Error): Action => ({
  type: actionTypes.GET_LISTS_FAILURE,
  payload: error.message
});


export function addList(spHttpClient: SPHttpClient, currentWebUrl: string, title: string) {
  return async (dispatch: any) => {

    //Fire the 'request' action if you want to update the state to specify that an ajax request is being made.
    //This can be used to show a loading screen or a spinner.
    dispatch(addListRequest());

    const spOpts: ISPHttpClientOptions = {
      body: `{ Title: '${title}', BaseTemplate: 100 }`
    };

    try {
      const response: SPHttpClientResponse = await spHttpClient.post(`${currentWebUrl}/_api/web/lists`, SPHttpClient.configurations.v1, spOpts);
      const list: IODataList = await response.json();

      //Fire the 'success' action when you want to update the state based on a successfull request.
      dispatch(addListSuccess(list.Title));

    } catch (error) {
      //Fire the 'error' action when you want to update the state based on an error request.
      dispatch(addListError(error));
    }
  };

}


export function getLists(spHttpClient: SPHttpClient, currentWebUrl: string, listTitle: string, title: string) {
  return (dispatch) => {
    dispatch(getListsRequest());
    // return spHttpClient.get(`${currentWebUrl}/_api/web/lists/getbytitle(${listTitle})/items(1)`, SPHttpClient.configurations.v1)
    //   .then(response => response.json())
    //   .then(json => console.log("NUMERO UNO: ", json))
    // .then(
    //   () => {

     return spHttpClient.get(`${currentWebUrl}/_api/web/lists/getByTitle('${listTitle}')/items`, SPHttpClient.configurations.v1)
      .then(response => response.json())
      .then(json => json.value)
      .then(lists => dispatch(getListsSuccess(title, lists)))
      .catch(error => dispatch(getListsError(error)));
      // }
    //  );

  };
}
