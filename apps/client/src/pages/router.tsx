import { ChannelDetailPage } from '@/pages/channels/ChannelDetailPage';
import { ChannelOverviewPage } from '@/pages/channels/ChannelOverviewPage';
import { Dashboard } from '@/pages/dashboard';
import { GroupDetailPage } from '@/pages/groups/GroupDetailPage';
import { GroupOverviewPage } from '@/pages/groups/GroupOverviewPage';
import { MessageOverviewPage } from '@/pages/messages/MessageOverviewPage';
import { NotFoundPage } from '@/pages/not-found';
import { PlaygroundPage } from '@/pages/playground/PlaygroundPage';
import { StampDetailPage } from '@/pages/stamps/StampDetailPage';
import { StampOverviewPage } from '@/pages/stamps/StampOverViewPage';
import { SubscriptionSettingsPage } from '@/pages/subscriptions/SubscriptionSettingsPage';
import { TagOverviewPage } from '@/pages/tags/TagOverviewPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';
import { UserOverviewPage } from '@/pages/users/UserOverviewPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/users', element: <UserOverviewPage /> },
  { path: '/users/:username', element: <UserDetailPage /> },
  { path: '/channels', element: <ChannelOverviewPage /> },
  { path: '/channels/*', element: <ChannelDetailPage /> },
  { path: '/stamps', element: <StampOverviewPage /> },
  { path: '/stamps/:stampName', element: <StampDetailPage /> },
  { path: '/messages', element: <MessageOverviewPage /> },
  { path: '/groups', element: <GroupOverviewPage /> },
  { path: '/groups/:groupName', element: <GroupDetailPage /> },
  { path: '/tags', element: <TagOverviewPage /> },
  { path: '/subscriptions', element: <SubscriptionSettingsPage /> },
  { path: '/playground', element: <PlaygroundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
