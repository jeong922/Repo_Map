'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className='w-10 h-10' aria-hidden='true' />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='cursor-pointer p-2 rounded-xl bg-surface border border-border-subtle hover:bg-brand/10 transition-all text-text-main flex items-center justify-center'
      aria-label='Toggle Theme'
    >
      {theme === 'dark' ? <Sun size={20} className='text-brand' /> : <Moon size={20} className='text-text-muted' />}
    </button>
  );
};
