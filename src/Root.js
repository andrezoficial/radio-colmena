import { lazy, Suspense, useEffect, useState } from 'react';
import App from './App';

// El panel se carga aparte: los oyentes no descargan nada de él.
const Admin = lazy(() => import('./Admin'));

const isAdminRoute = () => window.location.hash === '#admin';

export default function Root() {
  const [admin, setAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const onChange = () => setAdmin(isAdminRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  if (!admin) return <App />;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <Admin />
    </Suspense>
  );
}
