import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const meAtom = atom(null);
export const useAuth = () => {
  const [me, setMe] = useAtom(meAtom);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => {
        setMe(data);
      })
      .catch((err) => {
        console.error(err);
        setMe(null);
      });
  }, []);

  const login = () => {
    location.href = '/api/auth/request';
  };

  return { me, login };
};
