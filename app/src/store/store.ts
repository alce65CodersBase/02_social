import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../reducers/slice';

export const appStore = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export type AppDispatch = typeof appStore.dispatch;
export type RootState = ReturnType<typeof appStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
