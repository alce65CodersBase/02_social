import { Action, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/user';
import { RootState } from '../store/store';
import { usersReducer, updateRelations } from './slice';

let initialState: RootState['users'];

describe('Given usersReducer', () => {
  beforeEach(() => {
    initialState = {
      loadingUsersStatus: 'idle',
      users: [
        {
          id: 1,
        } as unknown as User,
      ],
      userLoggingStatus: 'idle',
      userLogged: {
        token: '',
        user: {} as User,
      },
    };
  });
  describe('When the action is user/logout', () => {
    test('Then it should change userLogged in the state', () => {
      const action: Action = {
        type: 'user/logout',
      };
      const state = usersReducer(initialState, action);
      expect(state.userLogged).toBe(null);
    });
  });

  describe('When the action is user/updateRelations', () => {
    test('Then it should update a user with a new relation', () => {
      initialState.users = [
        ...initialState.users,
        {
          id: 2,
        } as unknown as User,
      ];
      const newRelation: User = {
        id: 1,
        friends: [{ id: 2 }],
      } as unknown as User;
      const action = updateRelations(newRelation);
      const state = usersReducer(initialState, action);
      expect(state.users[0].id).toBe(1);
      //
    });
  });

  // Actions from asyncLoadUsers: user/load

  describe('When the action is user/load pending', () => {
    test('Then it should load a list of users', () => {
      initialState.users = [];
      const users = [{ id: 6 } as unknown as User];
      const action: PayloadAction<User[]> = {
        type: 'user/load/pending',
        payload: users,
      };
      const state = usersReducer(initialState, action);
      expect(state.loadingUsersStatus).toBe('loading');
      expect(state.users).toEqual([]);
    });
  });

  describe('When the action is user/load fulfilled', () => {
    test('Then it should load a list of users', () => {
      initialState.users = [];
      const users = [{ id: 6 } as unknown as User];
      const action: PayloadAction<User[]> = {
        type: 'user/load/fulfilled',
        payload: users,
      };
      const state = usersReducer(initialState, action);
      expect(state.users).toEqual(users);
      expect(state.loadingUsersStatus).toBe('idle');
    });
  });

  describe('When the action is user/load rejected', () => {
    test('Then it should load a list of users', () => {
      initialState.users = [];
      const users = [{ id: 6 } as unknown as User];
      const action: PayloadAction<User[]> = {
        type: 'user/load/rejected',
        payload: users,
      };
      const state = usersReducer(initialState, action);
      expect(state.users).toEqual([]);
      expect(state.loadingUsersStatus).toBe('error');
    });
  });

  // Actions from asyncLogin: user/login
  describe('When the action is user/login pending', () => {
    test('Then it should load the data of the logged user', () => {
      initialState.userLogged = null;
      const userLogged = {
        token: 'token',
        user: { id: 1 } as unknown as User,
      };
      type Payload = typeof userLogged;
      const action: PayloadAction<Payload> = {
        type: 'user/login/pending',
        payload: userLogged,
      };
      const state = usersReducer(initialState, action);
      expect(state.userLogged).toEqual(null);
      expect(state.userLoggingStatus).toBe('loading');
    });
  });

  describe('When the action is user/login fulfilled', () => {
    test('Then it should load the data of the logged user', () => {
      const userLogged = {
        token: '',
        user: {} as unknown as User,
      };
      type Payload = typeof userLogged;
      const action: PayloadAction<Payload> = {
        type: 'user/login/fulfilled',
        payload: userLogged,
      };
      const state = usersReducer(initialState, action);
      expect(state.userLogged).toEqual(userLogged);
      expect(state.userLoggingStatus).toBe('idle');
    });
  });

  describe('When the action is user/login rejected', () => {
    test('Then it should load the data of the logged user', () => {
      initialState.userLogged = null;
      const userLogged = {
        token: 'token',
        user: { id: 1 } as unknown as User,
      };
      type Payload = typeof userLogged;
      const action: PayloadAction<Payload> = {
        type: 'user/login/rejected',
        payload: userLogged,
      };
      const state = usersReducer(initialState, action);
      expect(state.userLogged).toEqual(null);
      expect(state.userLoggingStatus).toBe('error');
    });
  });
});
