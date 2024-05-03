import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import { useAuth } from '@/hooks/useAuth';
import { Dashboard } from '@/pages/dashboard';
import { LandingPage } from '@/pages';

const App = () => {
  const { me } = useAuth();

  return (
    <MantineProvider>{me ? <Dashboard /> : <LandingPage />}</MantineProvider>
  );
};

export default App;
