import { ai } from '@/lib/gemini';
import { generateAnalysis } from '@/lib/repoAnalysis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Prompt 생성
    const promptStart = performance.now();

    const userPrompt = await generateAnalysis(body.prompt);

    const promptEnd = performance.now();

    // 토큰 측정 (개발 환경에서만)
    let inputTokens = 0;
    let tokenDuration = 0;

    if (process.env.NODE_ENV === 'development') {
      const tokenStart = performance.now();

      const tokenResponse = await ai.models.countTokens({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
      });

      const tokenEnd = performance.now();

      inputTokens = tokenResponse.totalTokens ?? 0;
      tokenDuration = (tokenEnd - tokenStart) / 1000;
    }

    // 실제 Gemini 생성 시간 측정
    const generateStart = performance.now();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
    });

    const generateEnd = performance.now();

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // usage metadata 활용
    const usage = response.usageMetadata;

    const outputTokens = usage?.candidatesTokenCount ?? 0;
    const totalTokens = usage?.totalTokenCount ?? 0;

    // 시간 계산
    const promptDuration = ((promptEnd - promptStart) / 1000).toFixed(2);

    const generationDuration = ((generateEnd - generateStart) / 1000).toFixed(2);

    const totalDuration = ((generateEnd - promptStart) / 1000).toFixed(2);

    // 성능 로그
    console.log('====================================');
    console.log('[Gemini 성능 리포트]');
    console.log(`- Prompt 생성 시간: ${promptDuration}s`);

    if (process.env.NODE_ENV === 'development') {
      console.log(`- 입력 토큰 수: ${inputTokens}`);
      console.log(`- 토큰 계산 시간: ${tokenDuration.toFixed(2)}s`);
    }

    console.log(`- 출력 토큰 수: ${outputTokens}`);
    console.log(`- 총 토큰 수: ${totalTokens}`);
    console.log(`- Gemini 생성 시간: ${generationDuration}s`);
    console.log(`- 전체 처리 시간: ${totalDuration}s`);
    console.log('====================================');

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

    console.error('API Error:', errorMessage);

    if (errorMessage.includes('Unexpected end of JSON input')) {
      return NextResponse.json({ success: false, error: 'JSON 형식으로 보내주세요.' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
