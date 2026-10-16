import '@testing-library/jest-dom/vitest';

if (!window.localStorage) {
  const entries = new Map();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => entries.get(String(key)) ?? null,
      setItem: (key, value) => entries.set(String(key), String(value)),
      removeItem: (key) => entries.delete(String(key)),
      clear: () => entries.clear(),
    },
  });
}
