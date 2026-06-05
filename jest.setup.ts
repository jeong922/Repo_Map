import '@testing-library/jest-dom';

import { ReadableStream } from 'node:stream/web';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(globalThis, {
  ReadableStream,
  TextEncoder,
  TextDecoder,
});
