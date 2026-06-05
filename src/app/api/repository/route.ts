import { NextRequest, NextResponse } from 'next/server';
import { repositoryController } from './repositoryController';

export async function POST(req: NextRequest) {
  const result = await repositoryController(req);

  return NextResponse.json(result.body, { status: result.status });
}
