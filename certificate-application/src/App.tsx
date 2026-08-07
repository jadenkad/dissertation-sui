import './App.css';
import '@mysten/dapp-kit/dist/index.css'; // Add this for wallet modal styling

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Verify from './pages/verify';
import CreateCertificate from './pages/create-certificate';
import CreateInstitution from './pages/create-institution';
import Portfolio from './pages/portfolio';
import Navbar from './components/navbar';

// 1. Configure the network (e.g., Testnet)
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
});

// 2. Set up the Query Client (required for the wallet hooks)
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/verify" element={<Verify />} />
              <Route path="/create-certificate" element={<CreateCertificate />} />
              <Route path="/create-institution" element={<CreateInstitution />} />
              <Route path="/portfolio" element={<Portfolio />} />              
            </Routes>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}