import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.replace('/site/index.html');
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#FDF6EC' }}>
      <p style={{ color: '#12183A' }}>Redirecting to Just Party Decoration…</p>
    </div>
  );
}
