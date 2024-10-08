import { ChannelDetailPage } from '@/pages/channel-detail/ChannelDetailPage';
import { ChannelsOverviewPage } from '@/pages/channels-overview';
import { Dashboard } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';
import { StampDetailPage } from '@/pages/stamps/StampDetailPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';
import { UserOverviewPage } from '@/pages/users/UserOverviewPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/users',
    element: <UserOverviewPage />,
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
    path: '/channels/*',
    element: <ChannelDetailPage />,
  },
  {
    path: '/stamps/:stampName',
    element: <StampDetailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
