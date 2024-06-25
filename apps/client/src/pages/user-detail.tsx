import { useUsers } from '@/hooks/useUsers';
import { UserDetail } from '@/models/UserDetail';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

export const UserDetailPage: FC = () => {
  const params = useParams<{ username: string }>();
  const { getUserId } = useUsers();
  const userId = getUserId(params.username!);

  if (userId === undefined) {
    return <>User not found</>;
  }

  return <UserDetail userId={userId} />;
};
