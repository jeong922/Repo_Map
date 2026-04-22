import { ThemeToggle } from './ThemeToggle';

export const NavBar = () => {
  return (
    <nav className='h-16 flex items-center justify-between px-6 border-b border-border-subtle bg-surface/30 backdrop-blur-md sticky top-0 z-50'>
      <span className='text-xl font-bold text-text-main tracking-tighter'>Repo Map</span>
      <ThemeToggle />
    </nav>
  );
};
