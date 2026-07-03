import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PDFDocument } from 'pdf-lib';
import { MergePdfTool } from '../tools/MergePdfTool';
import { SplitPdfTool } from '../tools/SplitPdfTool';
import { JpgToPdfTool } from '../tools/JpgToPdfTool';
import { CompressPdfTool } from '../tools/CompressPdfTool';
import { RotatePdfTool } from '../tools/RotatePdfTool';
import { RemovePagesTool } from '../tools/RemovePagesTool';
import { PdfToJpgTool } from '../tools/PdfToJpgTool';

const TINY_PNG = Uint8Array.from(atob(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
), (c) => c.charCodeAt(0));

let pdf2: File;
let pdf3: File;

beforeAll(async () => {
  const make = async (n: number, name: string) => {
    const doc = await PDFDocument.create();
    for (let i = 0; i < n; i++) doc.addPage([200, 200]);
    const bytes = await doc.save();
    return new File([bytes.slice().buffer as ArrayBuffer], name, { type: 'application/pdf' });
  };
  pdf2 = await make(2, 'two.pdf');
  pdf3 = await make(3, 'three.pdf');
});

afterEach(() => vi.restoreAllMocks());

function stubDownload() {
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
  return vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
}

describe('MergePdfTool', () => {
  it('lists added files, reorders, and merges to a download', async () => {
    const click = stubDownload();
    render(<MergePdfTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf2, pdf3] } });
    expect(screen.getByText(/1\. two\.pdf/)).toBeInTheDocument();

    // Reorder: move three.pdf up.
    fireEvent.click(screen.getByRole('button', { name: /move three\.pdf up/i }));
    expect(screen.getByText(/1\. three\.pdf/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^merge/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/merged 2 files/i));
    expect(click).toHaveBeenCalledOnce();
  });

  it('keeps the merge button disabled with fewer than two files', () => {
    render(<MergePdfTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf2] } });
    expect(screen.getByRole('button', { name: /^merge/i })).toBeDisabled();
  });

  it('surfaces a friendly error for a corrupt file', async () => {
    stubDownload();
    render(<MergePdfTool />);
    const bad = new File([new Uint8Array([1, 2, 3])], 'bad.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf2, bad] } });
    fireEvent.click(screen.getByRole('button', { name: /^merge/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/bad\.pdf.*could not be read/i));
  });
});

describe('SplitPdfTool', () => {
  it('shows the page count, validates ranges, and extracts', async () => {
    const click = stubDownload();
    render(<SplitPdfTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf3] } });
    await screen.findByText(/three\.pdf · 3 pages/);

    const input = screen.getByLabelText(/pages to extract/i);
    fireEvent.change(input, { target: { value: '5' } });
    expect(screen.getByRole('alert')).toHaveTextContent(/out of range/i);

    fireEvent.change(input, { target: { value: '1,3' } });
    fireEvent.click(screen.getByRole('button', { name: /extract pages/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/extracted 2 pages/i));
    expect(click).toHaveBeenCalledOnce();
  });
});

describe('JpgToPdfTool', () => {
  it('converts images into a paged PDF download', async () => {
    const click = stubDownload();
    render(<JpgToPdfTool />);
    const png = new File([TINY_PNG], 'scan.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [png] } });
    fireEvent.click(screen.getByRole('button', { name: /convert 1 image/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/1-page PDF/i));
    expect(click).toHaveBeenCalledOnce();
  });
});

describe('CompressPdfTool', () => {
  it('renders levels after a file is added and states the rasterising caveat', () => {
    render(<CompressPdfTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf2] } });
    expect(screen.getByRole('radiogroup', { name: /compression level/i })).toBeInTheDocument();
    expect(screen.getByText(/not selectable/i)).toBeInTheDocument();

    const strong = screen.getByRole('radio', { name: /strong/i });
    fireEvent.click(strong);
    expect(strong).toBeChecked();
    expect(screen.getByRole('button', { name: /compress pdf/i })).toBeEnabled();
  });
});

describe('RotatePdfTool', () => {
  it('rotates and downloads the file', async () => {
    const click = stubDownload();
    render(<RotatePdfTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf2] } });
    fireEvent.click(screen.getByRole('button', { name: /90° right/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/rotated/i));
    expect(click).toHaveBeenCalledOnce();
  });
});

describe('RemovePagesTool', () => {
  it('shows page count, removes pages, and downloads', async () => {
    const click = stubDownload();
    render(<RemovePagesTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf3] } });
    await screen.findByText(/three\.pdf · 3 pages/);
    fireEvent.change(screen.getByLabelText(/pages to remove/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /remove pages/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/removed 1 page/i));
    expect(click).toHaveBeenCalledOnce();
  });

  it('blocks removing every page', async () => {
    render(<RemovePagesTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf3] } });
    await screen.findByText(/three\.pdf · 3 pages/);
    fireEvent.change(screen.getByLabelText(/pages to remove/i), { target: { value: '1-3' } });
    expect(screen.getByRole('alert')).toHaveTextContent(/keep at least one/i);
    expect(screen.getByRole('button', { name: /remove pages/i })).toBeDisabled();
  });
});

describe('PdfToJpgTool', () => {
  it('offers JPG/PNG format selection once a file is added', () => {
    render(<PdfToJpgTool />);
    fireEvent.change(screen.getByTestId('tool-fileinput'), { target: { files: [pdf2] } });
    expect(screen.getByRole('radiogroup', { name: /image format/i })).toBeInTheDocument();
    const png = screen.getByRole('radio', { name: /png/i });
    fireEvent.click(png);
    expect(png).toBeChecked();
    expect(screen.getByRole('button', { name: /convert to png/i })).toBeEnabled();
  });
});
