// others
import '@mantine/core/styles.css';
import './index.css';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
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
    <MapperContextProvider>
      <App />
    </MapperContextProvider>
  </MantineProvider>
);