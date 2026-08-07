import React from 'react';
import ReactDOM from 'react-dom/client';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import '@mysten/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
	devnet: { url: getFullnodeUrl('devnet') },
});
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
				<App />
			</SuiClientProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);