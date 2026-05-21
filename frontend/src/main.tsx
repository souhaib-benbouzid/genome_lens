import { store } from '@/store/index.ts';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-react-table/styles.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider>
    <Notifications />
    <Provider store={store}>
      <App />
    </Provider>
  </MantineProvider>,
);
