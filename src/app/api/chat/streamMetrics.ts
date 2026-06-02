export function createStreamMetrics() {
  const start = performance.now();

  let firstByteTime: number | null = null;
  let inputTokens = 0;
  let outputTokens = 0;

  return {
    markFirstByte() {
      if (firstByteTime === null) {
        firstByteTime = performance.now();
      }
    },

    setTokens(input: number, output: number) {
      inputTokens = input;
      outputTokens = output;
    },

    finalize() {
      const end = performance.now();

      return {
        ttfb: firstByteTime ? (firstByteTime - start) / 1000 : 0,
        generationTime: (end - start) / 1000,
        inputTokens,
        outputTokens,
      };
    },
  };
}
