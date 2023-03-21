import { SyntheticEvent } from 'react';
import { LoginData } from '../../models/user';
import { UserApiRepo } from '../../services/users.api.repo';
import { useDispatch } from 'react-redux';
import { asyncLogin } from '../../reducers/thunks';
import { AppDispatch } from '../../store/store';

export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const repo = new UserApiRepo();
  const handleSubmit = async (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formElement = ev.currentTarget;
    const formData: LoginData = {
      email: (formElement[0] as HTMLFormElement).value,
      passwd: (formElement[1] as HTMLFormElement).value,
    };
    dispatch(asyncLogin({ user: formData, repo }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="formGroup">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div className="formGroup">
        <label htmlFor="passwd">Password</label>
        <input type="password" id="passwd" name="passwd" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}
