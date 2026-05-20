import { getRepositoryContext } from '@/lib/github';
import { RepoResponse } from '@/types/github';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { owner, repo, branch } = body;

    if (!owner || !repo) {
      return NextResponse.json({ success: false, error: 'owner와 repo 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const data: RepoResponse = await getRepositoryContext(owner, repo, branch || undefined);

    return NextResponse.json({
      success: true,
      currentBranch: data.branchName,
      treeCount: data.tree.length,
      fileContentCount: data.fileContents.length,
      tree: data.tree,
      sourceContext: data.fileContents,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API Error:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
