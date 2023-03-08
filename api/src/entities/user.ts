export type Role = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwd: string;
  firstName: string;
  surname: string;
  role: string;
  friends: User[];
  enemies: User[];
};
