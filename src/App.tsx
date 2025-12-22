import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import './App.css';
import { useUserSession } from './lib/hooks/use-user-session';
import { useSync } from './lib/sync/use-sync';
import AppRouter from './routes/AppRouter';

function App() {
  // Handle user session and data isolation
  useUserSession();
  
  // Initialize sync with Convex
  useSync();

  return (
    <AppRouter />
  )
}

export default App
