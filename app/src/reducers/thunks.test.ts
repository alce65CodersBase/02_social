import { asyncLoadUsers, asyncLogin } from './thunks';
import { UserApiRepo } from '../services/users.api.repo';
import { LoginData, SuccessLoginData, User } from '../models/user';
import { appStore } from '../store/store';
import { waitFor } from '@testing-library/dom';

Storage.prototype.setItem = jest.fn();
const mockLoginResponse: SuccessLoginData = {
  user: {} as User,
  token: '',
};
const mockRepo: UserApiRepo = {
  loadUsers: jest.fn(),
  loginUser: jest.fn().mockResolvedValue(mockLoginResponse),
} as unknown as UserApiRepo;

describe('Given asyncLoadUsers', () => {
  describe('When the created action is dispatched', () => {
    test('Then loadUsers from the repo should be called', () => {
      appStore.dispatch(
        asyncLoadUsers({
          token: '',
          repo: mockRepo,
        })
      );
      expect(mockRepo.loadUsers).toHaveBeenCalled();
    });
  });
});

describe('Given asyncLogin', () => {
  describe('When the created action is dispatched', () => {
    test('Then loginUser from the repo should be called', async () => {
      appStore.dispatch(
        asyncLogin({
          user: {} as LoginData,
          repo: mockRepo,
        })
      );
      expect(mockRepo.loginUser).toHaveBeenCalled();
      waitFor(() => expect(Storage.prototype.setItem).toHaveBeenCalled());
    });
  });
});
