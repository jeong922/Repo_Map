'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoUrlInput } from './ui/RepoUrlInput';
import { parseGitHubUrl } from '@/lib/github-api';

export const SearchSection = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const handleSearch = (url: string) => {
    const { resultPath, error: parseError } = parseGitHubUrl(url);

    if (parseError) {
      setError(parseError);
      return;
    }

    setError('');
    router.push(`/repository/${resultPath}`);
  };

  return (
    <>
      <RepoUrlInput onSearch={handleSearch} />
      {error && (
        <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-subtle shadow-sm ...'>
          <span className='w-1.5 h-1.5 rounded-full bg-red-400' />
          <span className='text-xs font-medium text-text-muted'>{error}</span>
        </div>
      )}
    </>
  );
};
