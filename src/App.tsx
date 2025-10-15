import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';

function App() {
  useEffect(() => {
    const preventZoom = (event: { ctrlKey: boolean; metaKey: boolean; preventDefault: () => void; }) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    const preventRefresh = (event: { ctrlKey: boolean; metaKey: boolean; key: string; preventDefault: () => void; }) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === 'r' || event.key === 'R')) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', preventZoom, { passive: false });
    window.addEventListener('keydown', preventRefresh);

    return () => {
      window.removeEventListener('wheel', preventZoom);
      window.removeEventListener('keydown', preventRefresh);
    };
  }, []);

  return <AppRouter />;
}

export default App;

