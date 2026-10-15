'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoUrlInput } from './ui/RepoUrlInput';
import { parseGitHubUrl } from '@/lib/parseGitHubUrl';

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
      <RepoUrlInput onSearch={handleSearch} error={error} />
    </>
  );
};
