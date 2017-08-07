import * as Immutable from 'immutable';

export interface ILoadingState {
  loading: number;
}

export const initialState: ILoadingState = {
  loading: 0,
};

// Immutable State.
export class LoadingState extends Immutable.Record(initialState) implements ILoadingState {

  // Getters
  public readonly loading: number;

  public increaseLoading() {
    return this.set('loading', this.loading + 1) as LoadingState;
  }

  public decreaseLoading() {
    return this.set('loading', this.loading - 1) as LoadingState;
  }
}
