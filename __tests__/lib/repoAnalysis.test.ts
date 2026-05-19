import { generateAnalysis } from '@/lib/repoAnalysis';
import { RepositoryData } from '@/types/github';

describe('generateAnalysis', () => {
  const mockRepoData: RepositoryData = {
    success: true,
    currentBranch: 'main',
    treeCount: 2,
    fileContentCount: 1,
    tree: [
      { path: 'src/app.ts', type: 'blob' },
      { path: 'src/services/user.ts', type: 'blob' },
    ],
    sourceContext: [{ path: 'src/app.ts', content: 'const app = express();' }],
  };

  it('서버에서 받은 tree와 소스 코드를 프롬프트 템플릿에 올바르게 주입해야 한다', async () => {
    const result = await generateAnalysis(mockRepoData);

    expect(result).toContain('src/app.ts\nsrc/services/user.ts');

    expect(result).toContain('// === src/app.ts ===');
    expect(result).toContain('const app = express();');

    expect(result).toContain('# ROLE\nSenior Software Architect.');
    expect(result).toContain('### 1. 기술 스택');
  });

  it('데이터가 비어있어도 에러가 나지 않고 템플릿을 완성해야 한다', async () => {
    const emptyData: RepositoryData = {
      success: true,
      currentBranch: 'main',
      treeCount: 0,
      fileContentCount: 0,
      tree: [],
      sourceContext: [],
    };

    const result = await generateAnalysis(emptyData);
    expect(result).toBeTruthy();
    expect(result).toContain('# PROJECT STRUCTURE\n\n');
  });
});
