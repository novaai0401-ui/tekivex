import React from 'react';

interface FileDropProps {
  /** Accept attribute, e.g. "application/pdf" or "image/jpeg,image/png". */
  accept: string;
  multiple?: boolean;
  /** Called with the picked/dropped files (already filtered by extension/type). */
  onFiles: (files: File[]) => void;
  /** Prompt line, e.g. "Drop PDF files here". */
  label: string;
  /** Secondary line under the prompt. */
  hint?: string;
}

function matchesAccept(file: File, accept: string): boolean {
  return accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase();
    if (!r) return false;
    if (r.endsWith('/*')) return file.type.toLowerCase().startsWith(r.slice(0, -1));
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r);
    return file.type.toLowerCase() === r;
  });
}

/** Accessible drag-and-drop zone with a click-to-browse fallback. */
export function FileDrop({ accept, multiple = false, onFiles, label, hint }: FileDropProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const take = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list).filter((f) => matchesAccept(f, accept));
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      className={`tool-drop ${dragOver ? 'tool-drop--over' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); take(e.dataTransfer.files); }}
      data-testid="tool-filedrop"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => { take(e.target.files); e.target.value = ''; }}
        data-testid="tool-fileinput"
      />
      <div className="tool-drop-label">{label}</div>
      {hint && <div className="tool-drop-hint">{hint}</div>}
      <div className="tool-drop-privacy">🔒 Processed in your browser — never uploaded</div>
    </div>
  );
}
