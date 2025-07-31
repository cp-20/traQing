import { BrowserRouter, Route, Routes } from 'react-router';
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
import { UserGuard } from '@/pages/users/UserGuard';
import { UserOverviewPage } from '@/pages/users/UserOverviewPage';
import { YearlyRecapPage } from '@/pages/users/YearlyRecap';
import { YourRecapPage } from '@/pages/your-recap';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/your-recap/:year" element={<YourRecapPage />} />
      <Route path="/users" element={<UserOverviewPage />} />
      <Route path="/users" element={<UserGuard />}>
        <Route path=":username" element={<UserDetailPage />} />
        <Route path=":username/recap/:year" element={<YearlyRecapPage />} />
      </Route>
      <Route path="/channels" element={<ChannelOverviewPage />} />
      <Route path="/channels/*" element={<ChannelDetailPage />} />
      <Route path="/stamps" element={<StampOverviewPage />} />
      <Route path="/stamps/:stampName" element={<StampDetailPage />} />
      <Route path="/messages" element={<MessageOverviewPage />} />
      <Route path="/groups" element={<GroupOverviewPage />} />
      <Route path="/groups/:groupName" element={<GroupDetailPage />} />
      <Route path="/tags" element={<TagOverviewPage />} />
      <Route path="/subscriptions" element={<SubscriptionSettingsPage />} />
      <Route path="/playground" element={<PlaygroundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
