import { getRepositoryContext } from '@/lib/github';
import { RepoResponse } from '@/types/github';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const branch = searchParams.get('branch');

    if (!owner || !repo) {
      return NextResponse.json({ success: false, error: 'owner와 repo 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const data: RepoResponse = await getRepositoryContext(owner, repo, branch || undefined);

    const finalContext = data.fileContents.filter((f) => {
      const p = f.path.toLowerCase();
      return p.includes('src/') || p === 'package.json' || p.endsWith('/package.json');
    });

    return NextResponse.json({
      success: true,
      currentBranch: data.branchName,
      treeCount: data.tree.length,
      fileContentCount: data.fileContents.length,
      tree: data.tree,
      sourceContext: finalContext,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API Error:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
