import * as Immutable from 'immutable';

export interface IListState {
  agencyCodes: any[];
  stage1: any[];
}

export const initialState: IListState = {
  agencyCodes: [],
  stage1: [],
};

// Immutable State.
export class ListState extends Immutable.Record(initialState) implements IListState {

  // Getters
  public readonly agencyCodes: IListItems[];
  public readonly stage1: IListItems[];

  // Setters
  public addList(payload): ListState {
    const { title, item } = payload;

    return this.update(title, (lists: any[]) => {
      return lists.concat(item);
    }) as ListState;
  }

  public setLists(payload): ListState {
    const { title, lists } = payload;
    return this.set(title, lists) as ListState;
  }
}
