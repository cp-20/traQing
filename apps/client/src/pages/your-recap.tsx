import { useAuth } from '@/hooks/useAuth';
import { assert } from '@/lib/invariant';
import type { FC } from 'react';
import { Navigate, useParams } from 'react-router';

export const YourRecapPage: FC = () => {
  const { me } = useAuth();
  assert(me);
  const { year } = useParams<{ year: string }>();
  assert(year);

  const redirectTo = `/users/${me.name}/recap/${year}`;

  return <Navigate replace to={redirectTo} />;
};
