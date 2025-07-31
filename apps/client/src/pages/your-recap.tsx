import type { FC } from 'react';
import { Navigate, useParams } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { assert } from '@/lib/invariant';

export const YourRecapPage: FC = () => {
  const { me } = useAuth();
  assert(me);
  const { year } = useParams<{ year: string }>();
  assert(year);

  const redirectTo = `/users/${me.name}/recap/${year}`;

  return <Navigate replace to={redirectTo} />;
};
