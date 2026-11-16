import { useEffect } from 'react';
import { useToasts } from '../services/toastsContext.js';

// One listener for the whole application, not one per page.
export default function NetworkStatusListener() {
  const { dismissOffline, notifyOffline } = useToasts();
  useEffect(() => {
    const onOffline = () => notifyOffline();
    const onOnline = () => dismissOffline();
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    if (navigator.onLine === false) onOffline();
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [dismissOffline, notifyOffline]);

  return null;
}
