import { ChannelDetailPage } from '@/pages/channel-detail/ChannelDetailPage';
import { ChannelsOverviewPage } from '@/pages/channels-overview';
import { Dashboard } from '@/pages/dashboard';
import { NotFoundPage } from '@/pages/not-found';
import { StampDetailPage } from '@/pages/stamp-detail/StampDetailPage';
import { UserDetailPage } from '@/pages/user-detail/UserDetailPage';
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
