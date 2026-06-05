import { fetchRepoData } from '@/services/repoService';
import { RepositoryData } from '@/types/github';

describe('fetchRepoData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const mockResponse: RepositoryData = {
    success: true,
    currentBranch: 'main',
    treeCount: 1,
    fileContentCount: 1,
    tree: [],
    sourceContext: [],
  };

  it('GitHub URL을 파싱하여 API를 호출해야 한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchRepoData('https://github.com/jeong922/Repo_Map');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/repository'),
      expect.objectContaining({
        method: 'POST',
      }),
    );

    expect(result).toEqual(mockResponse);
  });

  it('branch 정보를 포함한 URL을 파싱해야 한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await fetchRepoData('https://github.com/jeong922/Repo_Map/tree/main');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          owner: 'jeong922',
          repo: 'Repo_Map',
          branch: 'main',
        }),
      }),
    );
  });

  it('잘못된 URL이면 예외를 던져야 한다', async () => {
    await expect(fetchRepoData('https://google.com')).rejects.toThrow('유효한 GitHub URL이 아닙니다.');
  });

  it('API 실패 시 서버 에러를 던져야 한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: 'Repository Not Found',
      }),
    });

    await expect(fetchRepoData('https://github.com/jeong922/Repo_Map')).rejects.toThrow('Repository Not Found');
  });

  it('API 실패 시 error가 없으면 기본 메시지를 사용해야 한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(fetchRepoData('https://github.com/jeong922/Repo_Map')).rejects.toThrow('데이터 로드에 실패했습니다.');
  });
});
