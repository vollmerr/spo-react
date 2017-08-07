import { ListState } from './ListState';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export interface RootState {
  form: any;
  lists: ListState;
  error: ErrorState;
  loading: LoadingState;
}
