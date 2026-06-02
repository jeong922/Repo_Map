export function logGeminiMetrics(meta: {
  ttfb: number;
  generationTime: number;
  totalTime: number;
  inputTokens: number;
  outputTokens: number;
  promptDuration: number;
}) {
  console.log('\n[Gemini 스트리밍 성능 분석]');
  console.log('------------------------------------');
  console.log(`TTFB               : ${meta.ttfb.toFixed(2)}s`);
  console.log(`생성 시간          : ${meta.generationTime.toFixed(2)}s`);
  console.log(`총 시간            : ${meta.totalTime.toFixed(2)}s`);
  console.log('------------------------------------');
  console.log(`입력 토큰          : ${meta.inputTokens}`);
  console.log(`출력 토큰          : ${meta.outputTokens}`);
  console.log(`프롬프트 준비 시간 : ${meta.promptDuration.toFixed(3)}s`);
  console.log('====================================\n');
}
