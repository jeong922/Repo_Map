'use client';

import { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis';
import { useRepository } from '@/hooks/useRepository';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ErrorView } from './common/ErrorView';
import { LoadingView } from './common/LoadingView';

interface Props {
  owner: string;
  repoName: string;
  branch?: string;
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  node?: unknown;
};

const MarkdownComponents: Components = {
  hr: () => <hr className='my-12 border-0 h-px bg-border-subtle/80' />,
  h3: ({ children }) => (
    <h3 className='group text-2xl font-bold text-text-main mt-8 mb-8 flex items-center gap-4'>
      <span className='h-8 w-1.5 bg-accent rounded-full scale-y-75 group-hover:scale-y-100 transition-transform duration-300' />
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className='text-lg font-bold text-accent-dark mt-10 mb-4'>{children}</h4>,
  p: ({ children }) => (
    <p className='text-lg leading-[1.8] text-text-main/80 mb-2 font-light dark:font-normal break-all whitespace-normal'>
      {children}
    </p>
  ),
  li: ({ children }) => (
    <li className='relative pl-8 mb-4 text-text-main/80 leading-relaxed list-none before:content-[""] before:absolute before:left-0 before:top-3 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/40'>
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className='font-bold text-text-main bg-accent-soft/50 px-1.5 py-0.5 rounded-md'>{children}</strong>
  ),
  code: ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (!inline && match) {
      return (
        <div className='my-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#1a1c1e]'>
          <div className='flex items-center gap-2 px-5 py-3 bg-white/3 border-b border-white/5'>
            <div className='flex gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30' />
              <div className='w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30' />
              <div className='w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30' />
            </div>
            <span className='ml-3 text-[10px] text-white/30 font-mono uppercase tracking-widest'>{match[1]}</span>
          </div>

          <div className='overflow-x-auto'>
            <SyntaxHighlighter
              {...props}
              style={nord}
              language={match[1]}
              PreTag='div'
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                fontSize: '0.85rem',
                lineHeight: '1.7',
                background: 'transparent',
                textShadow: 'none',
              }}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    return (
      <code
        className='px-1.5 py-0.5 mx-0.5 rounded-lg bg-accent/5 text-accent font-mono text-[0.85em] border border-accent/10 break-all whitespace-normal'
        {...props}
      >
        {children}
      </code>
    );
  },
};

export const RepositoryDetail = ({ owner, repoName, branch }: Props) => {
  const { data: repoData } = useRepository(owner, repoName, branch);
  const { analysisData, isAnalyzing, analysisError } = useRepoAnalysis(repoData ?? null);

  if (isAnalyzing) {
    return <LoadingView message='AI가 코드를 분석하여 인사이트를 도출하고 있습니다...' />;
  }

  if (analysisError) {
    return <ErrorView message='분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' />;
  }

  return (
    <div className='w-full min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-8'>
        {analysisData && (
          <article className='relative bg-surface border border-border-subtle rounded-4xl md:rounded-[3rem] shadow-2xl shadow-black/3 overflow-hidden transition-all duration-500 hover:shadow-black/6 animate-in fade-in slide-in-from-bottom-4'>
            <header className='relative px-8 pt-16 pb-12 md:px-16 border-b border-border-subtle bg-linear-to-br from-white/40 via-transparent to-transparent dark:from-white/3'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20'>
                  <div className='w-1.5 h-1.5 rounded-full bg-accent animate-pulse' />
                  <span className='text-[10px] font-bold text-accent uppercase tracking-[0.2em]'>
                    Gemini AI Insights
                  </span>
                </div>
              </div>

              <h1 className='text-2xl md:text-5xl font-bold tracking-tight text-text-main mb-6 bg-linear-to-r from-text-main to-text-main/60 bg-clip-text'>
                Codebase Analysis
              </h1>

              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/3 dark:bg-white/3 border border-border-subtle group transition-colors hover:border-accent/30 overflow-hidden max-w-full'>
                <span className='text-sm font-medium text-text-muted truncate group-hover:text-accent transition-colors'>
                  {owner} <span className='mx-1 opacity-30'>/</span> {repoName}
                </span>
                {branch && (
                  <span className='shrink-0 px-1.5 py-0.5 rounded-md bg-accent/10 text-[10px] text-accent font-bold uppercase'>
                    {branch}
                  </span>
                )}
              </div>
            </header>

            <div className='px-8 py-12 md:px-16 md:py-16 overflow-hidden w-full wrap-break-word'>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                {analysisData}
              </ReactMarkdown>
            </div>

            <footer className='px-8 py-8 border-t border-border-subtle bg-black/1 dark:bg-white/1 text-center'>
              <p className='text-xs text-text-muted font-medium opacity-60 flex items-center justify-center gap-2'>
                <span className='w-1 h-1 rounded-full bg-text-muted opacity-40' />
                이 분석은 AI에 의해 생성되었으며 실제 코드 구조와 차이가 있을 수 있습니다.
                <span className='w-1 h-1 rounded-full bg-text-muted opacity-40' />
              </p>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
};
