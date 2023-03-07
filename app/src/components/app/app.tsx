import { useDispatch, useSelector } from 'react-redux';
import { Login } from '../login/login';
import { Register } from '../register/register';
import './app.css';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { UserList } from '../users.list/users.list';
import { logout } from '../../reducers/slice';

type ToShow = 'register' | 'login' | 'users' | 'none';

export function App() {
  const { userLogged } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const [view, setView] = useState<ToShow>('none');

  const handleClick = (toShow: ToShow) => {
    setView(toShow);
  };

  const handleLogout = () => {
    setView('none');
    dispatch(logout());
  };

  useEffect(() => {
    setView('none');
  }, [userLogged]);

  return (
    <div className="App">
      <header>
        <nav>
          {userLogged ? (
            <>
              <button onClick={() => handleClick('users')}>Users List</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => handleClick('register')}>Register</button>
              <button onClick={() => handleClick('login')}>Login</button>
            </>
          )}
        </nav>

        <h1>Red Social</h1>
      </header>
      <main>
        {view === 'register' && <Register></Register>}
        {view === 'login' && <Login></Login>}
        {view === 'users' && <UserList></UserList>}
      </main>
    </div>
  );
}
