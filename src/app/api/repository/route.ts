import { getRepositoryContext, RepoResponse } from '@/lib/github';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const branch = searchParams.get('branch') || 'main';

    if (!owner || !repo) {
      return NextResponse.json({ success: false, error: 'owner와 repo 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const data: RepoResponse = await getRepositoryContext(owner, repo, branch);

    return NextResponse.json({
      success: true,
      treeCount: data.tree.length,
      fileContentCount: data.fileContents.length,
      tree: data.tree,
      // 임시로 일부만 가져오기
      sourceContext: data.fileContents.filter((f) => f.path.includes('src/')).slice(0, 3),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API Error:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
