import { ChannelsOverviewPage } from '@/pages/channels-overview';
import { Dashboard } from '@/pages/dashboard';
import { UserDetailPage } from '@/pages/user-detail';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/users/:username',
    element: <UserDetailPage />,
  },
  {
    path: '/channels',
    element: <ChannelsOverviewPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
