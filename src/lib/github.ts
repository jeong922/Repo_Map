import { FileNode, RepoResponse } from '@/types/github';
import { Octokit } from 'octokit';
import { BINARY_EXTENSIONS, EXCLUDE_PATTERNS, getPriority } from './extractionRules';
import { minifyCode } from './minifyCode';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  headers: {
    'X-GitHub-Api-Version': '2026-03-10',
  },
});

export async function getRepositoryContext(owner: string, repo: string, branch?: string): Promise<RepoResponse> {
  try {
    const targetBranch = branch || (await octokit.rest.repos.get({ owner, repo })).data.default_branch;

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
        return (
          !EXCLUDE_PATTERNS.some((pattern) => path.includes(pattern)) &&
          !BINARY_EXTENSIONS.some((ext) => path.endsWith(ext))
        );
      })
      .sort((a, b) => getPriority(a.path!) - getPriority(b.path!))
      .slice(0, 10);

    const contents = await Promise.all(
      sourceFiles.map(async (file) => {
        if (!file.sha) return null;

        try {
          const { data } = await octokit.rest.git.getBlob({ owner, repo, file_sha: file.sha });

          const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
          if (!decodedContent || decodedContent.trim().length === 0) return null;

          return {
            path: file.path!,
            content: minifyCode(decodedContent),
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
