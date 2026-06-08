import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryDetail } from '@/components/RepositoryDetail';
import { useRepository } from '@/hooks/useRepository';
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis';

jest.mock('@/hooks/useRepository');
jest.mock('@/hooks/useRepoAnalysis');

jest.mock('@/components/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => <div data-testid='markdown'>{content}</div>,
}));

describe('RepositoryDetail', () => {
  const mockRetryAnalysis = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('에러 상태', () => {
    it('분석 에러가 발생하면 ErrorView를 렌더링해야 한다', () => {
      (useRepository as jest.Mock).mockReturnValue({
        data: null,
      });

      (useRepoAnalysis as jest.Mock).mockReturnValue({
        analysisData: '',
        isAnalyzing: false,
        analysisError: new Error('analysis failed'),
        retryAnalysis: mockRetryAnalysis,
      });

      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      expect(screen.getByText(/분석 중 오류가 발생했습니다/i)).toBeInTheDocument();
    });

    it('재시도 버튼 클릭 시 retryAnalysis를 호출해야 한다', async () => {
      const user = userEvent.setup();

      (useRepository as jest.Mock).mockReturnValue({
        data: null,
      });

      (useRepoAnalysis as jest.Mock).mockReturnValue({
        analysisData: '',
        isAnalyzing: false,
        analysisError: new Error('analysis failed'),
        retryAnalysis: mockRetryAnalysis,
      });

      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      const retryButton = screen.getByRole('button');

      await user.click(retryButton);

      expect(mockRetryAnalysis).toHaveBeenCalledTimes(1);
    });
  });

  describe('로딩 상태', () => {
    it('분석 중이고 결과가 없으면 LoadingView를 렌더링해야 한다', () => {
      (useRepository as jest.Mock).mockReturnValue({
        data: {},
      });

      (useRepoAnalysis as jest.Mock).mockReturnValue({
        analysisData: '',
        isAnalyzing: true,
        analysisError: null,
        retryAnalysis: mockRetryAnalysis,
      });

      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      expect(screen.getByText(/AI가 코드를 분석하여 인사이트를 도출하고 있습니다/i)).toBeInTheDocument();
    });
  });

  describe('성공 상태', () => {
    beforeEach(() => {
      (useRepository as jest.Mock).mockReturnValue({
        data: {
          success: true,
        },
      });

      (useRepoAnalysis as jest.Mock).mockReturnValue({
        analysisData: '# 분석 결과',
        isAnalyzing: false,
        analysisError: null,
        retryAnalysis: mockRetryAnalysis,
      });
    });

    it('분석 결과를 렌더링해야 한다', () => {
      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      expect(screen.getByTestId('markdown')).toHaveTextContent('# 분석 결과');
    });

    it('owner/repo 정보를 표시해야 한다', () => {
      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      expect(screen.getByText(/jeong922/i)).toBeInTheDocument();
      expect(screen.getByText(/Repo_Map/i)).toBeInTheDocument();
    });

    it('branch가 존재하면 branch를 표시해야 한다', () => {
      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' branch='main' />);

      expect(screen.getByText('main')).toBeInTheDocument();
    });

    it('분석이 진행 중이면 Gemini AI Analyzing 상태를 표시해야 한다', () => {
      (useRepoAnalysis as jest.Mock).mockReturnValue({
        analysisData: '# 분석 결과',
        isAnalyzing: true,
        analysisError: null,
        retryAnalysis: mockRetryAnalysis,
      });

      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      expect(screen.getByText(/Gemini AI Analyzing/i)).toBeInTheDocument();
    });

    it('분석이 완료되면 Gemini AI Insights 상태를 표시해야 한다', () => {
      render(<RepositoryDetail owner='jeong922' repoName='Repo_Map' />);

      expect(screen.getByText(/Gemini AI Insights/i)).toBeInTheDocument();
    });
  });
});
