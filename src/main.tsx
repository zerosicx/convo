import '@fontsource/gamja-flower';
// Supports weights 100-900
import '@fontsource-variable/raleway';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
