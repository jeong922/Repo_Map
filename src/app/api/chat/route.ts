import { isAllowedOrigin } from '@/lib/allowedOrigin';
import { chatRateLimit } from '@/lib/rateLimit';
import { generateAnalysis } from '@/lib/repoAnalysis';
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiStream } from './geminiStream';
import { createStreamMetrics } from './streamMetrics';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';

    const { success } = await chatRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json({ success: false, error: '요청 횟수를 초과했습니다.' }, { status: 429 });
    }

    const origin = req.headers.get('origin');
    if (!isAllowedOrigin(origin)) {
      return NextResponse.json({ success: false, error: '허용되지 않은 요청입니다.' }, { status: 403 });
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: '올바르지 않은 JSON 형식입니다.' }, { status: 400 });
    }

    if (!body.prompt) {
      return NextResponse.json({ success: false, error: 'prompt 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const promptStart = performance.now();
    const userPrompt = await generateAnalysis(body.prompt);
    const promptEnd = performance.now();
    const promptDuration = (promptEnd - promptStart) / 1000;

    const metrics = createStreamMetrics();

    const signal = req.signal;

    const stream = await getGeminiStream(userPrompt, {
      promptStart,
      promptDuration,
      metrics,
      signal,
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

    console.error('API Error:', errorMessage);

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
