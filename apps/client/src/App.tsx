import { NeedLogin } from '@/components/NeedLogin';
import { RouteAuthGuard } from '@/components/RouteAuthGuard';
import { router } from '@/pages/router';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import { RouterProvider } from 'react-router-dom';

const App = () => {
  return (
    <MantineProvider>
      <RouteAuthGuard
        component={<RouterProvider router={router} />}
        fallback={<NeedLogin />}
      />
    </MantineProvider>
  );
};

export default App;
