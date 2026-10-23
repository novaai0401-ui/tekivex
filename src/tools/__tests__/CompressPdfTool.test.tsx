import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// The rasterising engine needs a real canvas, so its output size is stubbed
// here. Browser measurements live in public/examples/compression-results.json.
const compressPdf = vi.fn();
vi.mock('../lib/pdfCompress', () => ({ compressPdf: (...a: unknown[]) => compressPdf(...a) }));

import { CompressPdfTool } from '../tools/CompressPdfTool';

function stubDownload() {
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
  return vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
}

function addFile(bytes: number) {
  const file = new File([new Uint8Array(bytes)], 'report.pdf', { type: 'application/pdf' });
  fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [file] } });
}

afterEach(() => {
  vi.restoreAllMocks();
  compressPdf.mockReset();
});

describe('CompressPdfTool download behaviour', () => {
  it('downloads straight away when the output is smaller', async () => {
    const click = stubDownload();
    compressPdf.mockResolvedValue(new Uint8Array(100));
    render(<CompressPdfTool />);
    addFile(1000);
    fireEvent.click(screen.getByRole('button', { name: /compress pdf/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/90% smaller/));
    expect(click).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /anyway/i })).toBeNull();
  });

  it('does not download a larger file unless asked', async () => {
    const click = stubDownload();
    compressPdf.mockResolvedValue(new Uint8Array(5000));
    render(<CompressPdfTool />);
    addFile(1000);
    fireEvent.click(screen.getByRole('button', { name: /compress pdf/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/bigger, not smaller/));
    expect(click).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /download the larger file anyway/i }));
    expect(click).toHaveBeenCalledTimes(1);
  });
});
