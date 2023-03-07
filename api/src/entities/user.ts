export type User = {
  id: string;
  email: string;
  passwd: string;
  firstName: string;
  surname: string;
  friends: User[];
  enemies: User[];
};
