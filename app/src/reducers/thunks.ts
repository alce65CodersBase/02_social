import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginData, SuccessLoginData, User } from '../models/user';
import { UserApiRepo } from '../services/users.api.repo';

export const asyncLoadUsers = createAsyncThunk<
  User[],
  { token: string; repo: UserApiRepo }
>('user/load', async ({ token, repo }) => {
  const response = await repo.loadUsers(token);
  // The value we return becomes the `fulfilled` action payload
  return response;
});

export const asyncLogin = createAsyncThunk<
  SuccessLoginData,
  { user: LoginData; repo: UserApiRepo }
>('user/login', async ({ user, repo }) => {
  const response = await repo.loginUser(user);
  console.log(response);
  // The value we return becomes the `fulfilled` action payload
  return response;
});
