import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './views/Home';
import { Solar } from './views/Solar';
import { EVCC } from './views/EVCC';
import { Heizung } from './views/Heizung';
import { Klimaanlage } from './views/Klimaanlage';
import { Lueftung } from './views/Lueftung';
import { Wasser } from './views/Wasser';
import { Autos } from './views/Autos';
import { Dreame } from './views/Dreame';
import { Wallbox } from './views/Wallbox';
import { Rollaeden } from './views/Rollaeden';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 3000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/solar" element={<Solar />} />
              <Route path="/evcc" element={<EVCC />} />
              <Route path="/heizung" element={<Heizung />} />
              <Route path="/klimaanlage" element={<Klimaanlage />} />
              <Route path="/lueftung" element={<Lueftung />} />
              <Route path="/wasser" element={<Wasser />} />
              <Route path="/autos" element={<Autos />} />
              <Route path="/dreame" element={<Dreame />} />
              <Route path="/wallbox" element={<Wallbox />} />
              <Route path="/rollaeden" element={<Rollaeden />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
