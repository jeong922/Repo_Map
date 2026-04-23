'use client';

import { ChangeEvent, SubmitEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSearch: (url: string) => void;
}

export const RepoUrlInput = ({ onSearch }: Props) => {
  const [url, setUrl] = useState('');

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      return;
    }

    onSearch(url);
  };

  return (
    <div className='flex flex-col items-center w-full max-w-2xl gap-6'>
      <p className='text-text-muted font-medium tracking-tight'>분석을 원하는 GitHub 링크를 입력해 주세요.</p>
      <div className='relative w-full group'>
        <form
          onSubmit={handleSubmit}
          className='relative flex items-center bg-surface/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-border-subtle shadow-2xl focus-within:border-brand/50 transition-all duration-300'
        >
          <input
            type='text'
            value={url}
            onChange={handleUrlChange}
            placeholder='https://github.com/username/repo'
            className='w-full p-4 bg-transparent outline-none text-text-main placeholder:text-text-muted/50 text-sm'
          />
          <button
            type='submit'
            aria-label='Analyze repository'
            className='cursor-pointer group/btn flex items-center justify-center px-5 h-14 bg-brand hover:bg-brand-hover transition-colors text-background'
          >
            <ArrowRight
              aria-hidden='true'
              size={20}
              className='group-hover/btn:translate-x-1 transition-transform duration-200'
            />
          </button>
        </form>
        <div className='absolute -inset-px bg-linear-to-r from-brand/20 to-transparent rounded-2xl -z-10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500' />
      </div>
    </div>
  );
};
