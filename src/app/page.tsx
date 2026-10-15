import { SearchSection } from '@/components/SearchSection';

export default function Home() {
  return (
    <div className='flex-1 w-full mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24'>
      <div className='mx-auto max-w-2xl mb-10 text-center'>
        <p className='mb-5 text-xs font-semibold tracking-widest text-accent-dark uppercase'>
          GitHub repository explorer
        </p>
        <h1 className='text-4xl sm:text-5xl font-semibold tracking-tight leading-tight'>
          코드를 읽기 전,
          <br />
          프로젝트를 이해하세요.
        </h1>
        <p className='mt-5 text-base sm:text-lg leading-relaxed text-text-muted'>
          GitHub 저장소의 구조와 코드 흐름을 분석하고,
          <br className='hidden sm:block' /> Gemini AI가 정리한 인사이트를 확인하세요.
        </p>
      </div>
      <SearchSection />
      <div className='mx-auto mt-14 grid max-w-2xl gap-6 border-t border-border-subtle pt-7 sm:grid-cols-3'>
        {[
          ['01', '저장소 연결', '분석할 GitHub 저장소 URL을 입력하세요.'],
          ['02', 'AI 코드 분석', '프로젝트 구조와 코드의 흐름을 살펴봅니다.'],
          ['03', '인사이트 확인', '분석 결과를 실시간으로 읽어보세요.'],
        ].map(([step, title, description]) => (
          <div key={step}>
            <span className='text-xs font-mono text-text-muted'>{step}</span>
            <h2 className='mt-2 text-sm font-semibold'>{title}</h2>
            <p className='mt-2 text-sm leading-relaxed text-text-muted'>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
