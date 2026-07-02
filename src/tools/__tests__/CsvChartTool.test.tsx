import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CsvChartTool } from '../tools/CsvChartTool';

afterEach(() => vi.restoreAllMocks());

function loadSample() {
  render(<CsvChartTool />);
  fireEvent.click(screen.getByRole('button', { name: /try sample data/i }));
}

describe('CsvChartTool', () => {
  it('charts the sample data as grouped bars with a legend', () => {
    loadSample();
    const svg = screen.getByRole('img');
    expect(svg.getAttribute('aria-label')).toMatch(/bar chart of Revenue, Expenses by Month/i);
    // 6 months × 2 series = 12 bar paths (plus axis lines, which are not paths).
    expect(svg.querySelectorAll('path').length).toBe(12);
    expect(screen.getByRole('list', { name: /series legend/i })).toBeInTheDocument();
  });

  it('switches chart kinds — line, area (first series note), donut (fold note)', () => {
    loadSample();
    fireEvent.click(screen.getByRole('button', { name: 'Line' }));
    expect(screen.getByRole('img').getAttribute('aria-label')).toMatch(/^line chart/i);

    fireEvent.click(screen.getByRole('button', { name: 'Area' }));
    expect(screen.getByText(/area shows the first selected series/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Donut' }));
    expect(screen.getByText(/fold into/i)).toBeInTheDocument();
    expect(screen.getByText('total')).toBeInTheDocument();
  });

  it('shows a hover tooltip on a bar and hides it on leave', () => {
    loadSample();
    const bar = screen.getByRole('img').querySelector('path')!;
    fireEvent.mouseEnter(bar);
    expect(screen.getByRole('status')).toHaveTextContent(/Jan.*Revenue/);
    fireEvent.mouseLeave(bar);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('offers the data as a table (relief view)', () => {
    loadSample();
    fireEvent.click(screen.getByText(/view data as a table/i));
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBe(7); // header + 6 months
  });

  it('exports SVG via a download', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    loadSample();
    fireEvent.click(screen.getByRole('button', { name: /download svg/i }));
    expect(click).toHaveBeenCalledOnce();
  });

  it('toggles series selection', () => {
    loadSample();
    fireEvent.click(screen.getByRole('checkbox', { name: /expenses/i }));
    // Single remaining series → no legend box (the title names it).
    expect(screen.queryByRole('list', { name: /series legend/i })).toBeNull();
    expect(screen.getByRole('img').querySelectorAll('path').length).toBe(6);
  });

  it('rejects a CSV with no numeric columns', () => {
    render(<CsvChartTool />);
    fireEvent.change(screen.getByLabelText(/paste csv data/i), { target: { value: 'A,B\nx,y\nz,w' } });
    expect(screen.getByRole('alert')).toHaveTextContent(/no numeric columns/i);
  });

  it('supports starting over', () => {
    loadSample();
    fireEvent.click(screen.getByRole('button', { name: /start over/i }));
    expect(screen.getByRole('button', { name: /try sample data/i })).toBeInTheDocument();
  });
});
