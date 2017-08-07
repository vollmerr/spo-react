import * as Immutable from 'immutable';

export interface IErrorState {
  error: string | null;
}

export const initialState: IErrorState = {
  error: null,
};

// Immutable State.
export class ErrorState extends Immutable.Record(initialState) implements IErrorState {

  // Getters
  public readonly error: string | null;

  public setError(error) {
    return this.set('error', error) as ErrorState;
  }

  public clearError() {
    return this.set('error', null) as ErrorState;
  }
}
