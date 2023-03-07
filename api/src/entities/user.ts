export type User = {
  id: string;
  email: string;
  passwd: string;
  name: string;
  familyName: string;
  friends: User[];
  enemies: User[];
};
