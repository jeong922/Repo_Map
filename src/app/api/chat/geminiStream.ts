import { logGeminiMetrics } from './geminiLogger';
import { streamGemini } from './geminiClient';

interface StreamMetrics {
  markFirstByte(): void;
  setTokens(input: number, output: number): void;
  finalize(): StreamMetricsResult;
}

interface StreamMetricsResult {
  ttfb: number;
  generationTime: number;
  inputTokens: number;
  outputTokens: number;
}

interface StreamOptions {
  promptStart: number;
  promptDuration: number;
  metrics: StreamMetrics;
  signal: AbortSignal;
}

export async function getGeminiStream(userPrompt: string, options: StreamOptions) {
  const { promptStart, promptDuration, metrics, signal } = options;

  const result = await streamGemini(userPrompt, signal);
  const firstChunk = await result.next();

  async function* chunks() {
    if (!firstChunk.done) {
      yield firstChunk.value;
      yield* result;
    }
  }

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        let finalUsage = null;

        for await (const chunk of chunks()) {
          if (signal.aborted) {
            break;
          }

          metrics.markFirstByte();

          if (chunk.text) {
            try {
              controller.enqueue(encoder.encode(chunk.text));
            } catch {
              break;
            }
          }

          if (chunk.usageMetadata) {
            finalUsage = chunk.usageMetadata;
          }
        }

        if (!signal.aborted) {
          if (finalUsage) {
            metrics.setTokens(finalUsage.promptTokenCount ?? 0, finalUsage.candidatesTokenCount ?? 0);
          }

          const { ttfb, generationTime, inputTokens, outputTokens } = metrics.finalize();

          const totalTime = (performance.now() - promptStart) / 1000;

          logGeminiMetrics({
            ttfb,
            generationTime,
            totalTime,
            inputTokens,
            outputTokens,
            promptDuration,
          });

          controller.close();
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error('Stream Error:', err);
          controller.error(err);
        }
      }
    },
    cancel(reason) {
      console.warn('Stream cancelled:', reason);
    },
  });
}
