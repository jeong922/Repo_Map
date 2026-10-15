import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';

export const NavBar = () => {
  return (
    <nav aria-label='주 탐색' className='w-full shrink-0 border-b border-border-subtle bg-surface'>
      <div className='mx-auto max-w-6xl h-16 flex items-center justify-between px-5 sm:px-8'>
        <Link href='/' className='flex items-center gap-2.5 rounded-md'>
          <span
            aria-hidden='true'
            className='flex h-7 w-7 items-center justify-center rounded-md bg-text-main text-surface text-sm font-mono font-semibold'
          >
            R
          </span>
          <span className='text-lg font-semibold text-text-main tracking-tight'>Repo Map</span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};
