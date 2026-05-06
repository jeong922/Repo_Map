'use client';

import { useRepoAnalysis } from '@/hooks/useRepoAnalysis';
import { useRepository } from '@/hooks/useRepository';
import { ErrorView } from './common/ErrorView';
import { LoadingView } from './common/LoadingView';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Props {
  owner: string;
  repoName: string;
  branch?: string;
}

export const RepositoryDetail = ({ owner, repoName, branch }: Props) => {
  const { data: repoData } = useRepository(owner, repoName, branch);
  const { analysisData, isAnalyzing, analysisError } = useRepoAnalysis(repoData ?? null);

  if (isAnalyzing) {
    return <LoadingView message={`AI가 코드를 분석하여 인사이트를 도출하고 있습니다.\n잠시만 기다려주세요.`} />;
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
              <MarkdownRenderer content={analysisData} />
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
