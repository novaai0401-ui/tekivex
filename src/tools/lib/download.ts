// Small helpers shared by every tool: trigger a client-side download and
// format byte counts for before/after size reporting.

export function downloadBlob(data: Uint8Array | Blob | string, filename: string, mime: string): void {
  const blob = data instanceof Blob
    ? data
    : new Blob([data instanceof Uint8Array ? (data.slice().buffer as ArrayBuffer) : data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a beat to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
