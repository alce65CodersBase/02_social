/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */

import { LoginData, ProtoUser, SuccessLoginData, User } from '../models/user';

type ApiResponse = {
  token?: string;
  results: unknown[];
};

export interface UsersApiRepoStructure {
  loadUsers(): Promise<User[]>;
  getUser(id: User['id']): Promise<User>;
  loginUser(user: ProtoUser): Promise<SuccessLoginData>;
  createUser(user: ProtoUser, type: string): Promise<User>;
  update(user: Partial<ProtoUser>): Promise<User>;
  delete(id: User['id']): Promise<void>;
}

export class UserApiRepo {
  url: string;
  constructor() {
    this.url = process.env.VITE_API_URL + '/users';
  }

  async loadUsers(token: string): Promise<User[]> {
    const resp = await fetch(this.url, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (!resp.ok)
      throw new Error('Error Http: ' + resp.status + '. ' + resp.statusText);
    const data = (await resp.json()) as ApiResponse;
    return data.results as User[];
  }

  async getUser(id: User['id']): Promise<User> {
    const url = this.url + '/' + id;
    const resp = await fetch(url);
    if (!resp.ok)
      throw new Error('Error Http: ' + resp.status + '. ' + resp.statusText);
    const data = (await resp.json()) as User;
    return data;
  }

  async loginUser(user: LoginData): Promise<SuccessLoginData> {
    const url = this.url + '/login';
    const { token, results } = await this.postUser(url, user);
    return {
      token: token as string,
      user: results[0],
    } as SuccessLoginData;
  }

  async createUser(user: ProtoUser): Promise<User> {
    const url = this.url + '/register';
    const { results } = await this.postUser(url, user);
    return results[0] as User;
  }

  private async postUser(
    url: string,
    user: Partial<User>
  ): Promise<ApiResponse> {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!resp.ok)
      throw new Error('Error Http: ' + resp.status + '. ' + resp.statusText);
    return resp.json();
  }

  async update(user: Partial<User>): Promise<User> {
    const url = this.url + '/' + user.id;
    const resp = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(user),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!resp.ok)
      throw new Error('Error Http: ' + resp.status + '. ' + resp.statusText);
    const data = (await resp.json()) as User;
    return data;
  }

  async delete(id: User['id']): Promise<void> {
    const url = this.url + '/' + id;
    const resp = await fetch(url, {
      method: 'DELETE',
    });
    if (!resp.ok)
      throw new Error('Error Http: ' + resp.status + '. ' + resp.statusText);
  }
}
