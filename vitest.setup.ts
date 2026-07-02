import '@testing-library/jest-dom';

// jsdom lacks Blob/File.arrayBuffer — polyfill via FileReader so the tools'
// file-processing tests can exercise real pdf-lib flows.
if (typeof window !== 'undefined' && !window.Blob.prototype.arrayBuffer) {
  window.Blob.prototype.arrayBuffer = function arrayBuffer(this: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const r = new window.FileReader();
      r.onload = () => resolve(r.result as ArrayBuffer);
      r.onerror = () => reject(r.error);
      r.readAsArrayBuffer(this);
    });
  };
}

// jsdom lacks URL.createObjectURL — stub it so download helpers can run.
if (typeof window !== 'undefined' && !window.URL.createObjectURL) {
  window.URL.createObjectURL = () => 'blob:vitest-stub';
  window.URL.revokeObjectURL = () => {};
}

// Polyfill localStorage for jsdom
if (typeof window !== 'undefined' && !window.localStorage) {
  const store: Record<string, string> = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => { store[key] = val; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    },
  });
}
