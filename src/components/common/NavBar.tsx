import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';

export const NavBar = () => {
  return (
    <nav className='w-full h-16 shrink-0 flex items-center justify-between px-6 border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 left-0 z-100'>
      <Link href='/'>
        <span className='text-xl font-bold text-text-main tracking-tighter'>Repo Map</span>
      </Link>
      <ThemeToggle />
    </nav>
  );
};
