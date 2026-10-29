import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis';
import { RepositoryData } from '@/types/github';

describe('useRepoAnalysis 자동 재시도', () => {
  it('부분 실패 후 이전 텍스트를 비우고 두 번째 요청의 응답만 표시해야 한다', async () => {
    const repoData: RepositoryData = {
      success: true,
      currentBranch: 'main',
      treeCount: 2,
      fileContentCount: 2,
      tree: [],
      sourceContext: [],
    };
    const partialText = 'OLD_PARTIAL';
    const retryText = '# NEW_RESULT';
    const encoder = new TextEncoder();
    let firstController!: ReadableStreamDefaultController<Uint8Array>;
    let secondController!: ReadableStreamDefaultController<Uint8Array>;
    const firstStream = new ReadableStream<Uint8Array>({
      start(controller) {
        firstController = controller;
      },
    });
    const secondStream = new ReadableStream<Uint8Array>({
      start(controller) {
        secondController = controller;
      },
    });
    const originalFetch = global.fetch;
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, body: firstStream })
      .mockResolvedValueOnce({ ok: true, body: secondStream });
    global.fetch = fetchMock;

    // 훅의 retry/retryDelay와 실제 서비스 구현을 그대로 사용한다.
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result, unmount } = renderHook(() => useRepoAnalysis(repoData), { wrapper });

    try {
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      await act(async () => {
        firstController.enqueue(encoder.encode(partialText));
      });
      await waitFor(() => expect(result.current.analysisData).toBe(partialText));

      // 첫 청크가 실제 상태에 반영된 뒤에만 읽기 오류를 발생시킨다.
      await act(async () => {
        firstController.error(new Error('stream interrupted'));
      });
      await waitFor(() => {
        expect(queryClient.getQueryState(['analysis', { count: 2, branch: 'main' }])?.fetchFailureCount).toBe(1);
      });
      expect(result.current.analysisData).toBe(partialText);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // 실제 1초 재시도를 기다리되, 두 번째 응답 청크는 아직 보내지 않는다.
      await waitFor(
        () => {
          expect(fetchMock).toHaveBeenCalledTimes(2);
          expect(result.current.analysisData).toBe('');
          expect(result.current.isAnalyzing).toBe(true);
        },
        { timeout: 3000 },
      );

      await act(async () => {
        secondController.enqueue(encoder.encode(retryText));
      });
      // 완료 캐시가 누적 오류를 가리지 않도록 스트림이 열린 상태에서도 검사한다.
      await waitFor(() => {
        expect(result.current.analysisData).toBe(retryText);
        expect(result.current.isAnalyzing).toBe(true);
      });

      await act(async () => {
        secondController.close();
      });
      await waitFor(() => expect(result.current.isAnalyzing).toBe(false));
      expect(result.current.analysisData).toBe(retryText);
      expect(result.current.analysisData).not.toContain(partialText);
      expect(result.current.analysisError).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      unmount();
      queryClient.clear();
      global.fetch = originalFetch;
    }
  });
});
