import { store } from '@/store/index.ts';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-react-table/styles.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, ui-monospace, monospace',
  headings: { fontFamily: 'Inter, system-ui, sans-serif' },
  colors: {
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1a1a1a',
      '#141414',
    ],
  },
  components: {
    Badge: { defaultProps: { radius: 'sm' } },
    Tabs: {
      styles: {
        tab: { fontWeight: 500 },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <Notifications />
    <Provider store={store}>
      <App />
    </Provider>
  </MantineProvider>,
);
