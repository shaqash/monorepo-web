import { useRegisterSW } from 'virtual:pwa-register/preact';

export function usePWA() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        console.log('SW Registered:', registration);
        // Check if service worker is already installed
        if (registration.installing) {
          console.log('SW Installing...');
        } else if (registration.waiting) {
          console.log('SW Waiting...');
        } else if (registration.active) {
          console.log('SW Active');
        }
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  return {
    needRefresh,
    offlineReady,
    setNeedRefresh,
    setOfflineReady,
    updateServiceWorker,
  };
}
