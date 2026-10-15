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
  const { analysisData, isAnalyzing, analysisError, retryAnalysis } = useRepoAnalysis(repoData ?? null);

  if (analysisError) {
    return (
      <ErrorView message={`분석 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.`} onRetry={() => retryAnalysis()} />
    );
  }

  if (isAnalyzing && !analysisData) {
    return <LoadingView message={`AI가 코드를 분석하여 인사이트를 도출하고 있습니다.\n잠시만 기다려주세요.`} />;
  }

  if (!analysisData) {
    return <LoadingView message='분석 결과를 준비하고 있습니다. 잠시만 기다려주세요.' />;
  }

  return (
    <div className='w-full mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12'>
      <article className='min-w-0 rounded-xl border border-border-subtle bg-surface'>
        <header className='border-b border-border-subtle px-5 py-7 sm:px-10 sm:py-9'>
          <div
            role='status'
            className='mb-5 inline-flex items-center gap-2 rounded-md border border-border-subtle px-2.5 py-1.5 text-xs font-medium text-text-muted'
          >
            <span
              aria-hidden='true'
              className={`h-1.5 w-1.5 rounded-full bg-accent ${isAnalyzing ? 'animate-pulse motion-reduce:animate-none' : ''}`}
            />
            {isAnalyzing ? 'Gemini AI Analyzing...' : 'Gemini AI Insights'}
          </div>
          <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight'>Codebase Analysis</h1>
          <div className='mt-3 flex flex-wrap items-center gap-2 text-sm text-text-muted'>
            <span className='break-all'>
              {owner} <span className='px-1'>/</span> {repoName}
            </span>
            {branch && (
              <span className='max-w-full break-all rounded border border-border-subtle px-2 py-0.5 text-xs font-mono'>
                {branch}
              </span>
            )}
          </div>
        </header>
        <div className='min-w-0 px-5 py-7 sm:px-10 sm:py-10' aria-busy={isAnalyzing}>
          <MarkdownRenderer content={analysisData} />
          {isAnalyzing && (
            <p className='mt-6 flex items-center gap-2 text-xs text-text-muted'>
              <span
                aria-hidden='true'
                className='h-1.5 w-1.5 rounded-full bg-accent animate-pulse motion-reduce:animate-none'
              />
              분석 내용을 작성하고 있습니다…
            </p>
          )}
        </div>
        <footer className='border-t border-border-subtle px-5 py-5 sm:px-10 text-xs leading-relaxed text-text-muted'>
          <p className='font-medium'>Powered by Google Gemini 2.5 Flash</p>
          <p className='mt-1'>이 분석은 AI에 의해 생성되었으며 실제 코드 구조와 차이가 있을 수 있습니다.</p>
        </footer>
      </article>
    </div>
  );
};
