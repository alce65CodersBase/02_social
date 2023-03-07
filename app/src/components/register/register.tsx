import { SyntheticEvent } from 'react';
import { RegisterData } from '../../models/user';
import { UserApiRepo } from '../../services/users.api.repo';

export function Register() {
  const repo = new UserApiRepo();

  const handleSubmit = (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formElement = ev.currentTarget;
    const formData: RegisterData = {
      firstName: (formElement[0] as HTMLFormElement).value,
      surname: (formElement[1] as HTMLFormElement).value,
      email: (formElement[2] as HTMLFormElement).value,
      passwd: (formElement[3] as HTMLFormElement).value,
    };

    repo.createUser({ ...formData, enemies: [], friends: [] });
    formElement.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="formGroup">
        <label htmlFor="firstName">Name</label>
        <input type="text" id="firstName" name="firstName" />
      </div>
      <div className="formGroup">
        <label htmlFor="surname">Surname</label>
        <input type="text" id="surname" name="surname" />
      </div>
      <div className="formGroup">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div className="formGroup">
        <label htmlFor="passwd">Password</label>
        <input type="password" id="passwd" name="passwd" />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  );
}
