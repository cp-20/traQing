import { MantineProvider } from '@mantine/core';
import { NeedLogin } from '@/components/NeedLogin';
import { RouteAuthGuard } from '@/components/RouteAuthGuard';
import { AppRouter } from '@/pages/router';

import '@mantine/core/styles.css';

const App = () => {
  return (
    <MantineProvider>
      <RouteAuthGuard component={<AppRouter />} fallback={<NeedLogin />} />
    </MantineProvider>
  );
};

export default App;
