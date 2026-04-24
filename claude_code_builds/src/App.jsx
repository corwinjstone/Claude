import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { StockDetail } from './pages/StockDetail';
import { Portfolio } from './pages/Portfolio';
import { Simulator } from './pages/Simulator';
import { Watchlist } from './pages/Watchlist';
import { News } from './pages/News';
import { Market } from './pages/Market';
import { Learn } from './pages/Learn';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/stock/:ticker" element={<StockDetail />} />
            <Route path="/portfolio"  element={<Portfolio />} />
            <Route path="/simulator"  element={<Simulator />} />
            <Route path="/watchlist"  element={<Watchlist />} />
            <Route path="/news"       element={<News />} />
            <Route path="/market"     element={<Market />} />
            <Route path="/learn"      element={<Learn />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
