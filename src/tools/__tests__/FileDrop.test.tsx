import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileDrop } from '../components/FileDrop';

function pdfFile(name: string): File {
  return new File([new Uint8Array([1])], name, { type: 'application/pdf' });
}

describe('FileDrop', () => {
  it('shows the prompt, hint, and privacy line', () => {
    render(<FileDrop accept="application/pdf" label="Drop PDFs" hint="hint text" onFiles={() => {}} />);
    expect(screen.getByText('Drop PDFs')).toBeInTheDocument();
    expect(screen.getByText('hint text')).toBeInTheDocument();
    expect(screen.getByText(/never uploaded/i)).toBeInTheDocument();
  });

  it('delivers picked files that match the accept filter', () => {
    const onFiles = vi.fn();
    render(<FileDrop accept="application/pdf,.pdf" multiple label="Drop" onFiles={onFiles} />);
    const input = screen.getByTestId('tool-fileinput');
    fireEvent.change(input, { target: { files: [pdfFile('a.pdf'), new File(['x'], 'b.txt', { type: 'text/plain' })] } });
    expect(onFiles).toHaveBeenCalledOnce();
    expect(onFiles.mock.calls[0]![0].map((f: File) => f.name)).toEqual(['a.pdf']);
  });

  it('takes only the first file when multiple is off', () => {
    const onFiles = vi.fn();
    render(<FileDrop accept="application/pdf" label="Drop" onFiles={onFiles} />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdfFile('a.pdf'), pdfFile('b.pdf')] } });
    expect(onFiles.mock.calls[0]![0]).toHaveLength(1);
  });

  it('accepts files via drag-and-drop', () => {
    const onFiles = vi.fn();
    render(<FileDrop accept="application/pdf" label="Drop" onFiles={onFiles} />);
    fireEvent.drop(screen.getByTestId('tool-filedrop'), { dataTransfer: { files: [pdfFile('d.pdf')] } });
    expect(onFiles).toHaveBeenCalledOnce();
  });
});
