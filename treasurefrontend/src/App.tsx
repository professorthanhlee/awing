import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TreasurePage from './pages/TreasurePage';

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <TreasurePage />
      </QueryClientProvider>
  );
}

export default App;