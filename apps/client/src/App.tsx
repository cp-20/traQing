import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { NeedLogin } from '@/components/NeedLogin';
import { RouteAuthGuard } from '@/components/RouteAuthGuard';
import { AppRouter } from '@/pages/router';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({
  defaultRadius: 'sm',
  primaryColor: 'blue',
});

const App = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <RouteAuthGuard component={<AppRouter />} fallback={<NeedLogin />} />
      </MantineProvider>
    </>
  );
};

export default App;
