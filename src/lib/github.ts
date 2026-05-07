import { FileNode, RepoResponse } from '@/types/github';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

const excludePatterns = [
  'node_modules',
  '.git',
  'package-lock.json',
  'yarn.lock',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.pdf',
  '__tests__',
  'test',
  'mock',
  '.github',
  '.vscode',
  'babel.config',
  'jest.config',
  '.gitignore',
];

const getPriority = (path: string): number => {
  const p = path.toLowerCase();

  if (p === 'package.json' || p.endsWith('/package.json')) return 1;

  if (p.includes('src/app') || p.includes('src/index')) return 2;

  if (p.startsWith('src/') && !p.includes('/utils/')) return 3;

  if (p.includes('/utils/')) return 4;

  if (p.endsWith('.html') || p.endsWith('.css')) return 5;

  return 6;
};

export async function getRepositoryContext(owner: string, repo: string, branch?: string): Promise<RepoResponse> {
  try {
    let targetBranch = branch;

    if (!targetBranch) {
      const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo });
      targetBranch = repoInfo.default_branch;
    }

    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: targetBranch,
      recursive: 'true',
    });

    const tree: FileNode[] = treeData.tree.map((item) => ({
      path: item.path!,
      type: item.type as 'blob',
    }));

    const sourceFiles = treeData.tree
      .filter((file) => {
        return file.type === 'blob' && !excludePatterns.some((pattern) => file.path?.includes(pattern));
      })
      .sort((a, b) => getPriority(a.path!) - getPriority(b.path!));

    console.log(
      'Filtered Files:',
      sourceFiles.map((f) => f.path),
    );

    const contents = await Promise.all(
      sourceFiles.map(async (file) => {
        if (!file.sha) return null;

        const { data } = await octokit.rest.git.getBlob({
          owner,
          repo,
          file_sha: file.sha,
        });

        const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');

        if (!decodedContent || decodedContent.trim().length === 0) return null;

        const minifiedContent = decodedContent
          .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
          .replace(/\n\s*\n/g, '\n')
          .trim()
          .substring(0, 5000);

        return {
          path: file.path!,
          content: minifiedContent,
        };
      }),
    );

    const fileContents = contents
      .filter((item): item is { path: string; content: string } => item !== null)
      .slice(0, 7);

    return {
      tree,
      fileContents,
      branchName: targetBranch,
    };
  } catch (error) {
    console.error('GitHub Data Fetch Error:', error);
    throw new Error('GitHub 데이터를 가져오는 데 실패했습니다.');
  }
}
