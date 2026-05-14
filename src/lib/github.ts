import { FileNode, RepoResponse } from '@/types/github';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

const excludePatterns = [
  '.git',
  '.github',
  '.vscode',
  '.idea',
  '.DS_Store',
  '.gitignore',
  '.eslintignore',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'cargo.lock',
  'gemfile.lock',
  'go.sum',
  'node_modules',
  'dist',
  'build',
  'out',
  'target',
  'vendor',
  'bin',
  'obj',
  '.next',
  '.nuxt',
  '.cache',
  'tmp',
  'temp',
  '__tests__',
  'test',
  'tests',
  'spec',
  'mock',
  '__mocks__',
  'coverage',
  '.nyc_output',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.pdf',
  '.mp4',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  'babel.config',
  'jest.config',
  'prettier.config',
  'webpack.config',
  'rollup.config',
  'tsconfig.json',
  'jsconfig.json',
  '.eslintrc',
  '.prettierrc',
  'postcss.config',
  'tailwind.config',
  'vite.config',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  '.log',
];

const getPriority = (path: string): number => {
  const p = path.toLowerCase();

  if (p.endsWith('package.json') || p.endsWith('requirements.txt') || p.endsWith('go.mod') || p.endsWith('cargo.toml'))
    return 1;

  if (
    p.includes('/services/') ||
    p.includes('/api/') ||
    p.includes('/logic/') ||
    p.includes('/controller/') ||
    p.includes('/domain/')
  )
    return 2;

  if (p.includes('/app/') || p.includes('/pages/') || p.includes('/routes/') || p.match(/(main|index|app)\.[a-z]+$/))
    return 3;

  if (p.includes('/components/') || p.includes('/modules/') || p.includes('/hooks/')) return 4;

  if (p.includes('/utils/') || p.includes('/helpers/') || p.includes('/common/')) return 5;

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
        if (file.type !== 'blob' || !file.path) {
          return false;
        }

        const path = file.path.toLowerCase();

        if (excludePatterns.some((pattern) => path.includes(pattern))) {
          return false;
        }

        const binaryExtensions = [
          '.exe',
          '.dll',
          '.so',
          '.pyc',
          '.zip',
          '.gz',
          '.tar',
          '.db',
          '.sqlite',
          '.bin',
          '.wasm',
        ];
        if (binaryExtensions.some((ext) => path.endsWith(ext))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => getPriority(a.path!) - getPriority(b.path!))
      .slice(0, 10);

    const contents = await Promise.all(
      sourceFiles.map(async (file) => {
        if (!file.sha) return null;

        try {
          const { data } = await octokit.rest.git.getBlob({
            owner,
            repo,
            file_sha: file.sha,
          });

          const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
          if (!decodedContent || decodedContent.trim().length === 0) return null;

          const minifiedContent = decodedContent
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
            .replace(/^\s*(import|from|require|package|using)\s+.*$/gm, '')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim()
            .substring(0, 2000);

          return {
            path: file.path!,
            content: minifiedContent,
          };
        } catch (e) {
          console.error(`Failed to fetch blob: ${file.path}`, e);
          return null;
        }
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
