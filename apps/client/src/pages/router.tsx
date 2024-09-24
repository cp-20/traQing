import { ChannelsOverviewPage } from '@/pages/channels-overview';
import { Dashboard } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';
import { UserDetailPage } from '@/pages/user-detail';
import { createBrowserRouter } from 'react-router-dom';

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
    element: <NotFoundPage />,
  },
]);
