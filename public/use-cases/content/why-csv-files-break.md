CSV looks like the simplest file format in the world: values, separated by commas, one row per line. That apparent simplicity is exactly why it breaks so often. There is no real CSV standard that software agrees on — just decades of tools making slightly different assumptions about separators, quotes, encodings, and dates. If you've ever opened an export and found the columns shifted, the accents mangled, or the product codes turned into dates, this guide explains what actually went wrong and how to fix it.

## There is no such thing as "standard CSV"

The closest thing CSV has to a specification is RFC 4180 — a 2005 memo that documents *common practice* rather than defining a standard, and that plenty of software ignores. In the wild, "CSV" means a family of dialects that differ on:

- what separates the values (comma? semicolon? tab?),
- how a value containing the separator is protected,
- how quotes inside values are escaped,
- what encoding the bytes are in,
- and how line endings are written.

Two programs can both be "reading CSV" and disagree on every one of those. Every mysterious CSV failure traces back to one of five problems below.

## Problem 1: The separator isn't what the reader expects

The most jarring discovery for many users: **in much of Europe and South America, "comma-separated" files are actually separated by semicolons.** In locales where the decimal separator is a comma (`3,14` instead of `3.14`), Excel writes and expects `;` between fields — otherwise every decimal number would split into two columns. So a French colleague's "CSV" may parse as one giant column on a US-configured machine, and vice versa.

The result is unmistakable: everything lands in a single column, with visible `;` or `,` between the values. The fix is equally simple once you know it — every serious import tool (including Excel's *Data → From Text/CSV*) lets you pick the delimiter. Files with a `.tsv` extension use tabs, which sidestep the decimal-comma problem entirely; that's why spreadsheets copied through the clipboard use tabs.

## Problem 2: Quoting — the part everyone gets subtly wrong

What happens when a value *contains* the separator, like a company name `"Smith, Jones & Co"`? CSV's answer: wrap the value in double quotes. And when the value contains a double quote? Double it — `"She said ""fine"""` means `She said "fine"`.

Three consequences trip people up:

- **A quoted value can contain a line break.** A multi-line address inside quotes is *one field on one logical row* that spans several physical lines. Tools that naively split the file on newlines shear these rows apart mid-field — the classic cause of a file whose row count differs between two programs.
- **Hand-built CSV is almost always broken CSV.** Code that produces CSV by joining strings with commas works right up until the first value with a comma in it, which may be months after deployment. Always emit through a CSV library, which quotes correctly.
- **Mismatched quotes cascade.** One unescaped quote early in a file can shift every field after it, so the visible damage (columns misaligned from row 8,000 on) appears far from the actual defect (a stray `"` on row 312).

## Problem 3: Encoding — why "café" becomes "cafÃ©"

A CSV file is bytes, and bytes only become letters through an encoding. When the writer and reader assume different encodings, non-ASCII characters garble in recognizable ways:

- `café` displaying as `cafÃ©` means a UTF-8 file was read as Windows-1252/Latin-1.
- `café` displaying as `caf?` or `caf�` means characters were destroyed going the *other* way — often unrecoverably.
- A file that works in one program and shows garbage in another is almost always an encoding disagreement, not corruption.

The historical culprit is that Excel on Windows traditionally assumed the system's legacy encoding unless the file started with a **byte-order mark (BOM)** — three invisible bytes (`EF BB BF`) that flag "this is UTF-8." That's why "CSV UTF-8" exists as a separate choice in Excel's save dialog, and why some exports carry a BOM that then confuses *other* software, which sees a phantom `ï»¿` glued to the first column's name.

The reliable convention today: **write UTF-8, and if Excel users are your audience, write UTF-8 with a BOM.** When importing a garbled file, don't edit the data — re-import with the correct encoding selected; the bytes were fine all along.

## Problem 4: Excel "helpfully" rewrites your data

The most expensive CSV problems aren't parsing failures — they're silent data changes made by spreadsheet software trying to be helpful. When Excel opens a CSV by double-click, it *guesses a type for every cell* and converts in place:

- **Leading zeros vanish.** ZIP code `02134` becomes `2134`; phone numbers and product codes with leading zeros are quietly altered.
- **Long numbers turn into scientific notation** — a 16-digit ID becomes `1.23457E+15`, and the trailing digits are *rounded away*. Card numbers, barcode values, and database IDs get destroyed this way.
- **Anything date-shaped becomes a date.** The fraction `3/4` becomes March 4th. This problem was so severe in genetics — gene names like *MARCH1* and *SEPT2* auto-converting — that in 2020 the scientific naming committee **renamed the genes** rather than keep fighting Excel.
- **Date order is locale-dependent.** `04/07/2026` is April 7th to an American system and 4 July to a British one. Ambiguous date formats in CSV are time bombs; the only safe interchange format is ISO 8601: `2026-07-04`.

Once saved, these conversions are permanent. The defenses: import via *Data → From Text/CSV* (which lets you mark columns as text) instead of double-clicking, or keep identifier-like columns quoted and typed as text at the source. If a dataset's integrity matters, don't round-trip it through a spreadsheet at all.

## Problem 5: The file is simply big

CSV has no index and no compression, so a multi-gigabyte export must be read start-to-finish. Classic Excel also has a hard ceiling of 1,048,576 rows — files beyond that load truncated, sometimes without an obvious warning. For quick looks at large files, command-line tools, database imports, or purpose-built viewers beat spreadsheets; for recurring pipelines, columnar formats like Parquet exist precisely because CSV stops scaling.

## How to diagnose a broken CSV in two minutes

1. **Open it in a plain text editor first** (Notepad, TextEdit, VS Code — not a spreadsheet). Most mysteries are visible instantly: the actual delimiter, stray quotes, garbled accents, a BOM, or header rows above the real data.
2. **Check the first line and one "bad" line side by side.** Count separators — a mismatch means a quoting problem on that row.
3. **Re-import, don't repair.** Choose the right delimiter and encoding in the import dialog and let the tool re-read the original bytes.
4. **Test the round trip.** Export, re-open, and compare a few tricky rows (accents, commas in values, leading zeros) before trusting a pipeline.

And when producing CSV for others: UTF-8 (with BOM if Excel-bound), one header row, ISO dates, values quoted by a real CSV library, and a note saying which delimiter you used. That single line of documentation prevents most of this article from happening to your recipients. If all you need from a clean CSV is a quick visualization, that's a solved problem too — a [browser-based CSV-to-chart tool](/tools/csv-to-chart) will parse a well-formed file in seconds without the data leaving your machine.
