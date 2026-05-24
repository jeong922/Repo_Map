import { isAllowedOrigin } from '@/lib/allowedOrigin';
import { ai } from '@/lib/gemini';
import { chatRateLimit } from '@/lib/rateLimit';
import { generateAnalysis } from '@/lib/repoAnalysis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';

    const { success } = await chatRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '요청 횟수를 초과했습니다.',
        },
        { status: 429 },
      );
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

    // --- [측정 시작] 프롬프트 생성 시간 측정 ---
    const promptStart = performance.now();
    const userPrompt = await generateAnalysis(body.prompt);
    const promptEnd = performance.now();
    const promptDuration = ((promptEnd - promptStart) / 1000).toFixed(3);

    // --- [측정 시작] AI 응답 생성 시간 측정 시점 ---
    const generateStart = performance.now();
    let firstByteTime: number | null = null;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let inputTokens = 0;
        let outputTokens = 0;
        let closed = false;

        try {
          const result = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
          });

          for await (const chunk of result) {
            // --- [측정] 첫 번째 데이터 조각이 도착한 시점(TTFB) 기록 ---
            if (firstByteTime === null) {
              firstByteTime = performance.now();
            }

            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }

            // --- [측정] 응답 메타데이터에서 실제 토큰 사용량 추출 ---
            if (chunk.usageMetadata) {
              outputTokens = chunk.usageMetadata.candidatesTokenCount ?? 0;
              inputTokens = (chunk.usageMetadata.totalTokenCount ?? 0) - outputTokens;
            }
          }

          const generateEnd = performance.now();

          // 생성 요청부터 첫 글자가 출력되기까지 걸린 시간
          const ttfb = firstByteTime ? ((firstByteTime - generateStart) / 1000).toFixed(2) : '0.00';
          // 전체 생성 시간
          const generationDuration = ((generateEnd - generateStart) / 1000).toFixed(2);
          // 총 프로세스 시간
          const totalDuration = ((generateEnd - promptStart) / 1000).toFixed(2);

          console.log('\n[Gemini 스트리밍 성능 분석]');
          console.log('------------------------------------');
          console.log(`사용자 체감 대기 (TTFB) : ${ttfb}s`);
          console.log(`전체 텍스트 생성 시간   : ${generationDuration}s`);
          console.log(`총 프로세스 완료 시간   : ${totalDuration}s`);
          console.log('------------------------------------');
          console.log(`입력 토큰 수           : ${inputTokens}`);
          console.log(`출력 토큰 (생성량)     : ${outputTokens}`);
          console.log(`프롬프트 준비 시간     : ${promptDuration}s`);
          console.log('====================================\n');
        } catch (err) {
          console.error('Stream Error:', err);

          controller.enqueue(encoder.encode('\n\nAI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요.'));
        } finally {
          if (!closed) {
            closed = true;
            controller.close();
          }
        }
      },
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
