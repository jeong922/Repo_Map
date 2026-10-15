'use client';

import { ChangeEvent, SubmitEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSearch: (url: string) => void;
  error?: string;
}

export const RepoUrlInput = ({ onSearch, error }: Props) => {
  const [url, setUrl] = useState('');

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return;
    }

    onSearch(trimmedUrl);
  };

  return (
    <div className='mx-auto flex flex-col w-full max-w-2xl gap-4 rounded-xl border border-border-subtle bg-surface p-5 sm:p-7'>
      <p className='text-text-muted font-medium tracking-tight'>분석을 원하는 GitHub 링크를 입력해 주세요.</p>
      <div className='w-full'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:flex-row sm:items-start'>
          <label htmlFor='repository-url' className='sr-only'>
            GitHub 저장소 URL
          </label>
          <input
            id='repository-url'
            aria-invalid={!!error}
            aria-describedby={error ? 'repository-url-help repository-url-error' : 'repository-url-help'}
            autoCapitalize='none'
            autoCorrect='off'
            spellCheck={false}
            type='text'
            value={url}
            onChange={handleUrlChange}
            placeholder='GitHub 저장소 URL을 입력하세요'
            className='min-w-0 flex-1 h-12 rounded-lg border border-border-subtle bg-background px-3 text-text-main placeholder:text-text-muted text-sm'
          />
          <button
            type='submit'
            disabled={!url.trim()}
            aria-label='Analyze repository'
            className='button-primary h-12 shrink-0 gap-2'
          >
            분석하기
            <ArrowRight
              aria-hidden='true'
              size={20}
              className='group-hover/btn:translate-x-1 transition-transform duration-200'
            />
          </button>
        </form>
        <p id='repository-url-help' className='mt-3 text-xs leading-relaxed text-text-muted wrap-break-word'>
          예) github.com/jeong922/Repo_Map 또는 https://github.com/jeong922/Repo_Map
        </p>
        {error && (
          <p id='repository-url-error' role='alert' className='mt-3 text-sm text-danger'>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
