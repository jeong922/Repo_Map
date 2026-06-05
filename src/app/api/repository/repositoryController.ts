import { isAllowedOrigin } from '@/lib/allowedOrigin';
import { getRepositoryContext } from '@/lib/github';
import { repositoryRateLimit } from '@/lib/rateLimit';
import { RepoResponse } from '@/types/github';
import { NextRequest } from 'next/server';

type RequestLike = Pick<NextRequest, 'headers' | 'json'>;

interface ControllerResponse {
  status: number;
  body: unknown;
}

export async function repositoryController(req: RequestLike): Promise<ControllerResponse> {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';

    const { success } = await repositoryRateLimit.limit(ip);

    if (!success) {
      return {
        status: 429,
        body: {
          success: false,
          error: '요청 횟수를 초과했습니다.',
        },
      };
    }

    const origin = req.headers.get('origin');

    if (!isAllowedOrigin(origin)) {
      return {
        status: 403,
        body: {
          success: false,
          error: '허용되지 않은 요청입니다.',
        },
      };
    }

    const body = await req.json();

    const { owner, repo, branch } = body;

    if (!owner || !repo) {
      return {
        status: 400,
        body: {
          success: false,
          error: 'owner와 repo 파라미터가 누락되었습니다.',
        },
      };
    }

    const data: RepoResponse = await getRepositoryContext(owner, repo, branch || undefined);

    return {
      status: 200,
      body: {
        success: true,
        currentBranch: data.branchName,
        treeCount: data.tree.length,
        fileContentCount: data.fileContents.length,
        tree: data.tree,
        sourceContext: data.fileContents,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

    console.error('API Error:', errorMessage);

    return {
      status: 500,
      body: {
        success: false,
        error: errorMessage,
      },
    };
  }
}
