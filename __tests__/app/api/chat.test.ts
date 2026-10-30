/** @jest-environment node */

import { NextRequest } from 'next/server';
import { ApiError as GeminiApiError, GenerateContentResponse } from '@google/genai';
import { POST } from '@/app/api/chat/route';
import { streamGemini } from '@/app/api/chat/geminiClient';
import { chatRateLimit } from '@/lib/rateLimit';

jest.mock('@/lib/rateLimit', () => ({ chatRateLimit: { limit: jest.fn() } }));
jest.mock('@/lib/allowedOrigin', () => ({ isAllowedOrigin: () => true }));
jest.mock('@/lib/repoAnalysis', () => ({ generateAnalysis: async () => 'test prompt' }));
jest.mock('@/app/api/chat/geminiClient', () => ({ streamGemini: jest.fn() }));
jest.mock('@/app/api/chat/geminiLogger', () => ({ logGeminiMetrics: jest.fn() }));

const request = () =>
  new NextRequest('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt: {} }),
    headers: { 'Content-Type': 'application/json' },
  });

describe('POST /api/chat 초기 Gemini 오류 처리', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest
      .mocked(chatRateLimit.limit)
      .mockResolvedValue({ success: true } as Awaited<ReturnType<typeof chatRateLimit.limit>>);
  });

  afterEach(() => jest.restoreAllMocks());

  it.each([429, 503])('Gemini 연결 오류 %i를 JSON HTTP 상태로 유지한다', async (status) => {
    jest.mocked(streamGemini).mockRejectedValue(new GeminiApiError({ status, message: 'upstream error' }));

    const response = await POST(request());

    expect(response.status).toBe(status);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      success: false,
      error: 'AI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요.',
    });
  });

  it('첫 결과 읽기 중 503도 응답 시작 전에 처리한다', async () => {
    async function* failedStream(): AsyncGenerator<GenerateContentResponse> {
      throw new GeminiApiError({ status: 503, message: 'first read failed' });
    }
    jest.mocked(streamGemini).mockResolvedValue(failedStream());

    const response = await POST(request());

    expect(response.status).toBe(503);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect((await response.json()).success).toBe(false);
  });

  it('미리 읽은 첫 청크를 누락하거나 중복하지 않는다', async () => {
    async function* successfulStream() {
      yield { text: 'FIRST ' } as GenerateContentResponse;
      yield { text: 'SECOND' } as GenerateContentResponse;
    }
    jest.mocked(streamGemini).mockResolvedValue(successfulStream());

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
    expect(await response.text()).toBe('FIRST SECOND');
  });

  it('Redis 등 일반 예외를 재시도 가능한 Gemini 오류로 바꾸지 않는다', async () => {
    jest.mocked(chatRateLimit.limit).mockRejectedValue(new Error('Redis failed'));

    const response = await POST(request());

    expect(response.status).toBe(500);
    expect(jest.mocked(streamGemini)).not.toHaveBeenCalled();
  });
});
