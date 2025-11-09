import './app.css';
import { WllamaProvider } from './utils/wllama.context';
import { usePWA } from './utils/usePWA';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from './utils/idbPersister';
import { Chat } from './components/Chat/Chat';
import { OfflineNotif } from './components/PWA/OfflineNotif';
import { NewContentNotif } from './components/PWA/NewContentNotif';
import { ModelDownloadBar } from './components/ModelDownloadBar/ModelDownloadBar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
});

const persister = createIDBPersister();

export function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onError={() => {
        console.error('Unable to cache');
      }}
    >
      <WllamaProvider>
        <Main />
      </WllamaProvider>
    </PersistQueryClientProvider>
  );
}

export function Main() {
  const { needRefresh, offlineReady, updateServiceWorker } = usePWA();

  return (
    <>
      <ModelDownloadBar />
      <NewContentNotif
        needRefresh={needRefresh}
        updateServiceWorker={updateServiceWorker}
      />
      <OfflineNotif offlineReady={offlineReady} />
      <Chat />
    </>
  );
}
