import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export interface FileNode {
  path: string;
  type: 'blob' | 'tree';
  content?: string;
}

export interface RepoResponse {
  tree: FileNode[];
  fileContents: { path: string; content: string }[];
}

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
];

export async function getRepositoryContext(
  owner: string,
  repo: string,
  branch: string = 'main',
): Promise<RepoResponse> {
  try {
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });

    const tree: FileNode[] = treeData.tree.map((item) => ({
      path: item.path,
      type: item.type as 'blob',
    }));

    const sourceFiles = treeData.tree.filter((file) => {
      return file.type === 'blob' && !excludePatterns.some((pattern) => file.path?.includes(pattern));
    });

    const contents = await Promise.all(
      // 일단 50개만 잘라오기
      sourceFiles.slice(0, 50).map(async (file) => {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path!,
          ref: branch,
        });

        if ('content' in data) {
          const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
          return {
            path: file.path,
            content: decodedContent,
          };
        }

        return null;
      }),
    );

    const fileContents = contents.filter((item): item is { path: string; content: string } => item !== null);

    return {
      tree,
      fileContents,
    };
  } catch (error) {
    console.error('GitHub Data Fetch Error:', error);
    throw new Error('GitHub 데이터를 가져오는 데 실패했습니다.');
  }
}
