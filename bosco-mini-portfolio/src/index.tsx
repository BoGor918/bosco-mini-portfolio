// others
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
// global components
import MapperContextProvider from './globalVariable/MapperContextProvider';
// page components
import App from './App';

// render
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// render
root.render(
  <MantineProvider>
    <Notifications />
    <MapperContextProvider>
      <App />
    </MapperContextProvider>
  </MantineProvider>
);