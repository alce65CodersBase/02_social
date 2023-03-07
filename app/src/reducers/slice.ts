import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/user';
import { asyncLoadUsers, asyncLogin } from './thunks';

type Status = 'loading' | 'idle' | 'error';

type State = {
  userLoggingStatus: Status;
  userLogged: {
    token: string;
    user: User;
  } | null;
  loadingUsersStatus: Status;
  users: User[];
};

const initialState: State = {
  userLoggingStatus: 'idle',
  userLogged: null,
  loadingUsersStatus: 'idle',
  users: [],
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.userLogged = null;
      state.users = [];
    },
    updateRelations(state, action: PayloadAction<User>) {
      state.userLogged!.user = action.payload;
      state.users = state.users.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(asyncLoadUsers.pending, (state) => {
      state.loadingUsersStatus = 'loading';
    });
    builder.addCase(asyncLoadUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loadingUsersStatus = 'idle';
    });
    builder.addCase(asyncLoadUsers.rejected, (state) => {
      state.loadingUsersStatus = 'error';
    });
    builder.addCase(asyncLogin.pending, (state) => {
      state.userLoggingStatus = 'loading';
    });
    builder.addCase(asyncLogin.fulfilled, (state, action) => {
      state.userLoggingStatus = 'idle';
      state.userLogged = {
        token: action.payload.token,
        user: action.payload.user,
      };
    });
    builder.addCase(asyncLogin.rejected, (state) => {
      state.userLoggingStatus = 'error';
      state.userLogged = null;
    });
  },
});

export const { logout, updateRelations } = slice.actions;
export const usersReducer = slice.reducer;
