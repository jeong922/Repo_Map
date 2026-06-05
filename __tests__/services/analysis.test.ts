import { analyzeRepository } from '@/services/analysis';
import { ApiError } from '@/types/apiError';
import { RepositoryData } from '@/types/github';

describe('analyzeRepository', () => {
  const mockRepoData: RepositoryData = {
    success: true,
    currentBranch: 'main',
    treeCount: 2,
    fileContentCount: 2,
    tree: [],
    sourceContext: [],
  };

  const mockOnChunk = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('스트림 데이터를 성공적으로 읽고 fullText를 반환해야 한다', async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('Hello '));
        controller.enqueue(new TextEncoder().encode('World!'));
        controller.close();
      },
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    const result = await analyzeRepository(mockRepoData, mockOnChunk);

    expect(result).toBe('Hello World!');
    expect(mockOnChunk).toHaveBeenCalledTimes(2);
    expect(mockOnChunk).toHaveBeenNthCalledWith(1, 'Hello ');
    expect(mockOnChunk).toHaveBeenNthCalledWith(2, 'World!');
  });

  it('서버 응답이 실패(404)하면 ApiError를 던져야 한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({
        error: 'Not Found',
      }),
    });

    await expect(analyzeRepository(mockRepoData, mockOnChunk)).rejects.toBeInstanceOf(ApiError);
  });

  it('response.body가 없으면 ApiError를 던져야 한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: null,
    });

    await expect(analyzeRepository(mockRepoData, mockOnChunk)).rejects.toThrow('응답 스트림을 읽을 수 없습니다.');
  });

  it('reader.read 중 에러가 발생하면 503 ApiError를 던져야 한다', async () => {
    const brokenStream = {
      getReader() {
        return {
          read: jest.fn().mockRejectedValue(new Error('stream error')),
        };
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: brokenStream,
    });

    try {
      await analyzeRepository(mockRepoData, mockOnChunk);
      fail('에러가 발생해야 함');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);

      const apiError = error as ApiError;

      expect(apiError.status).toBe(503);
      expect(apiError.message).toBe('AI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요.');
    }
  });

  it('fetch 자체가 실패하면 원본 에러를 그대로 전달해야 한다', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(analyzeRepository(mockRepoData, mockOnChunk)).rejects.toThrow('Network Error');
  });
});
