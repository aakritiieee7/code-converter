import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useEffect, useState } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={() => setIsDark((v) => !v)}
          className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm hover:bg-white/20 transition"
        >
          {isDark ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      <Component {...pageProps} />
    </>
  );
} 