import { Loader } from '@mantine/core';
import type { FC } from 'react';
import { Navigate, useParams } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { assert } from '@/lib/invariant';

export const YourRecapPage: FC = () => {
  const { me } = useAuth();
  const { year } = useParams<{ year: string }>();
  assert(year);

  if (!me) {
    return (
      <div className="traqing-loading-host grid place-content-center">
        <Loader type="bars" size="xl" />
      </div>
    );
  }

  const redirectTo = `/users/${me.name}/recap/${year}`;

  return <Navigate replace to={redirectTo} />;
};
