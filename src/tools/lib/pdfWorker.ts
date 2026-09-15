// Keep Vite's asset URL import static inside a lazy browser-only module.
// Importing a ?url asset dynamically can be optimized as JavaScript in dev.
export { default as pdfWorkerSrc } from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
