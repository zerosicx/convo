import '@fontsource/gamja-flower';
import "@fontsource/raleway"; // Defaults to weight 400
import "@fontsource/raleway/400-italic.css"; // Specify weight and style
import "@fontsource/raleway/400.css"; // Specify weight
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
