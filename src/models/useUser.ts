import { useEffect, useState } from 'react';
import { createModel } from 'hox';
import axios from 'axios';
import { useRequest } from 'ahooks';

function useUser() {
  const [requesting, setRequesting] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const { run: authenticate, refreshAsync: refreshUserAsync } = useRequest(
    () => axios.get<IUser>('/user/info'),
    {
      manual: true,
      onBefore() {
        setRequesting(true);
      },
      onSuccess({ data, status }) {
        if (status !== 200) {
          localStorage.removeItem('token');
          setUser(undefined!);
          return;
        }
        setUser({
          id: data.id,
          role: data.role,
          username: data.username,
        });
      },
      onFinally() {
        setRequesting(false);
      },
    },
  );

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (token) {
      authenticate();
    } else {
      setRequesting(false);
    }
  }, [authenticate, setRequesting]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(undefined!);
  };
  return {
    setRequesting,
    requesting,
    user,
    setUser,
    logout,
    refreshUserAsync,
  };
}

export default createModel(useUser);
