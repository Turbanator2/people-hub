// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean the DOM after each test
afterEach(() => {
  cleanup();
});

// ✅ Polyfill window.matchMedia for jsdom so libraries like "sonner" work in tests
if (!globalThis.matchMedia) {
  globalThis.matchMedia = (query: string) => {
    return {
      matches: false,
      media: query,
      // legacy API
      onchange: null,
      addListener: vi.fn(),          // deprecated
      removeListener: vi.fn(),       // deprecated
      // modern API
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  };
}
