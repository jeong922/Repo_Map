import { repositoryController } from '@/app/api/repository/repositoryController';
import { repositoryRateLimit } from '@/lib/rateLimit';
import { isAllowedOrigin } from '@/lib/allowedOrigin';
import { getRepositoryContext } from '@/lib/github';

jest.mock('@/lib/rateLimit', () => ({
  repositoryRateLimit: {
    limit: jest.fn(),
  },
}));

jest.mock('@/lib/allowedOrigin', () => ({
  isAllowedOrigin: jest.fn(),
}));

jest.mock('@/lib/github', () => ({
  getRepositoryContext: jest.fn(),
}));

type MockRequest = {
  headers: Headers;
  json: jest.Mock;
};

const createRequest = (body: unknown = {}, origin = 'http://localhost:3000'): MockRequest => ({
  headers: new Headers({ origin }),
  json: jest.fn().mockResolvedValue(body),
});

describe('repositoryController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('429 - rate limit 초과', async () => {
    (repositoryRateLimit.limit as jest.Mock).mockResolvedValue({
      success: false,
    });

    const result = await repositoryController(createRequest());

    expect(result.status).toBe(429);
    expect(result.body).toEqual({
      success: false,
      error: '요청 횟수를 초과했습니다.',
    });
  });

  it('403 - 허용되지 않은 origin', async () => {
    (repositoryRateLimit.limit as jest.Mock).mockResolvedValue({
      success: true,
    });

    (isAllowedOrigin as jest.Mock).mockReturnValue(false);

    const result = await repositoryController(createRequest());

    expect(result.status).toBe(403);
  });

  it('400 - owner 또는 repo 누락', async () => {
    (repositoryRateLimit.limit as jest.Mock).mockResolvedValue({
      success: true,
    });

    (isAllowedOrigin as jest.Mock).mockReturnValue(true);

    const result = await repositoryController(createRequest({}));

    expect(result.status).toBe(400);
  });

  it('200 - repository 정보 조회 성공', async () => {
    (repositoryRateLimit.limit as jest.Mock).mockResolvedValue({
      success: true,
    });

    (isAllowedOrigin as jest.Mock).mockReturnValue(true);

    (getRepositoryContext as jest.Mock).mockResolvedValue({
      branchName: 'main',
      tree: [{ path: 'src/index.ts' }],
      fileContents: [{ path: 'src/index.ts', content: 'hello' }],
    });

    const result = await repositoryController(
      createRequest({
        owner: 'jeong922',
        repo: 'Repo_Map',
      }),
    );

    expect(result.status).toBe(200);

    expect(result.body).toEqual({
      success: true,
      currentBranch: 'main',
      treeCount: 1,
      fileContentCount: 1,
      tree: [{ path: 'src/index.ts' }],
      sourceContext: [
        {
          path: 'src/index.ts',
          content: 'hello',
        },
      ],
    });
  });

  it('500 - getRepositoryContext 에러', async () => {
    (repositoryRateLimit.limit as jest.Mock).mockResolvedValue({
      success: true,
    });

    (isAllowedOrigin as jest.Mock).mockReturnValue(true);

    (getRepositoryContext as jest.Mock).mockRejectedValue(new Error('github api error'));

    const result = await repositoryController(
      createRequest({
        owner: 'jeong922',
        repo: 'Repo_Map',
      }),
    );

    expect(result.status).toBe(500);

    expect(result.body).toEqual({
      success: false,
      error: 'github api error',
    });
  });
});
