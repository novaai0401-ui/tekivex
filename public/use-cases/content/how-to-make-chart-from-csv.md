You've got a spreadsheet or a CSV file full of numbers, and you need a chart — for a report, a presentation, or just to actually see what the data is telling you. You don't want to wrestle with spreadsheet chart menus, and you certainly don't want to upload a file of sales figures to some random website. Tekivex's [CSV to Chart](/tools/csv-to-chart) tool turns your data into a clean, downloadable chart right inside your browser, in seconds.

Not sure your file's ready? There's a **Try sample data** button so you can see how it works before touching your own numbers.

![A grouped bar chart of Revenue versus Expenses by month, made with the CSV to Chart tool](/images/tools/csv-chart-bar.png)

## How to make a chart from a CSV

1. Open the [CSV to Chart](/tools/csv-to-chart) tool. No install, no account.
2. Drop your CSV file onto the tool, or paste the CSV text directly. Make sure the **first row contains your column headers** (like Month, Revenue, Expenses).
3. Pick your **label column** — the one that names each item along the axis, such as Month.
4. Pick the **numeric series** you want to plot. You can chart up to 8 series at once, like Revenue and Expenses side by side.
5. Choose a chart type: **bar**, **line**, **area**, or **donut**. Switch between them freely to see which tells your story best.
6. Hover over the chart for tooltips with exact values, or view your data as a table to double-check it.
7. Download the finished chart as an **SVG** (stays razor-sharp at any size — great for print and slides) or a **PNG** (a standard image). You can also **Copy a shareable link**.

![The same data shown as a donut chart in the CSV to Chart tool](/images/tools/csv-chart-donut.png)

## Worked example: revenue rises, but so do expenses

[Download this example CSV](/examples/monthly-revenue-expenses.csv), or paste the following into the tool. These are invented teaching values, not customer data or measured business results. Revenue and expenses use the same currency and represent totals for each month.

```csv
Month,Revenue,Expenses
January,12000,8000
February,15000,9500
March,14000,10000
April,18000,11000
```

Choose **Month** for labels and **Revenue** and **Expenses** for the two numeric series. In a bar chart, you should see four month groups, with two values per group. Check the data table: April should show revenue of 18,000 and expenses of 11,000. If it does not, check your column selections and delimiter before trusting the image.

January's difference is 12,000 − 8,000 = **4,000**; March's is 14,000 − 10,000 = **4,000**. March has more revenue than January but the same difference after these expenses. April's difference is **7,000**. The chart does not calculate a profit series automatically; add a separate column to your CSV if you want to plot that difference. These two columns alone do not establish accounting profit because the example does not include other costs or taxes.

A line chart makes the month-to-month change easier to follow. Keep the rows in chronological order: labels are displayed in CSV order, so sorting month names alphabetically would tell the wrong story. Avoid a donut for this comparison; a single set of slices does not explain the gap between two series over time.

Suggested text alternative: "Revenue and expenses from January to April. Revenue rises from 12,000 to 18,000; expenses rise from 8,000 to 11,000. The difference is 4,000 in both January and March, then 7,000 in April." Include the four-row data table alongside the exported image.

## Good to know and limitations

- **Up to 8 numeric series.** You can plot as many as eight series at once. For a **donut** chart, any slices beyond the top 8 are folded together into a single "Other" slice to keep it readable.
- **Comma-separated files work best.** If your file uses semicolons or tabs instead of commas, re-save it as a standard comma CSV first (most spreadsheets let you choose the delimiter when exporting).
- **A shareable link contains your data.** The tool encodes the chart data after `#` in the URL. That fragment is not included in the HTTP request for the page, but it is not encryption or access control. Anyone with the complete link can read the data. It can also be stored by browser history, extensions, or the messaging service you use to share it. For confidential data, export a suitably redacted chart instead of sharing a data-bearing URL.
- **Dark mode is supported**, so your charts look right whether you prefer light or dark.

![A CSV to Chart bar chart displayed in dark mode](/images/tools/csv-chart-dark.png)

If you need deeper analysis — filtering, pivoting, exploring larger datasets — take a look at [Analytics Studio](/product/analytics-studio). And if you're browsing our other free tools, the [tools hub](/tools) has the full set.

## Picking the right chart type for your data

The tool offers four chart types, and the choice matters more than any styling option:

- **Bar** — the default for comparing categories: sales by region, tickets by team, spend by month. Bars stay readable even with longer category names, and every value is visible.
- **Line** — for anything measured over time. A line makes the trend the story: growth, seasonality, a sudden drop. Use it when the horizontal axis is dates or ordered periods.
- **Area** — a line chart that also emphasises cumulative magnitude. Good for showing volume building over time; less good when several series overlap and hide each other.
- **Donut** — for showing shares of a whole, and only that. Beyond a handful of slices it stops being readable, which is why the tool folds smaller slices into "Other" after eight — if every category matters, a bar chart tells the story better.

If you're unsure, try bar first and switch — the preview updates instantly, and switching costs nothing since the data is already loaded.

## Where to get a clean CSV

Every spreadsheet and analytics product exports CSV: in Excel or Google Sheets use *File → Download/Save As → CSV*; most databases, banking portals, and admin dashboards have an "Export CSV" button. Keep the header row — the tool uses it to name your columns — and prefer comma-separated output over semicolons or tabs, which need converting first.

## Frequently asked questions

### What does my CSV need to look like?

A header row on top, then your data below it, comma-separated. One column holds labels (like Month or Category), and one or more columns hold numbers. If you're unsure, hit **Try sample data** to see a working example.

### My file uses semicolons — will it work?

Re-save it as a comma-separated CSV first. Most spreadsheet apps let you choose the delimiter when you export, so pick comma. Tab-separated files should be converted the same way.

### How do I make the chart accessible when I share it?

A chart image on its own is invisible to screen-reader users, so pair it with a text alternative. When you embed the image, write alt text that states the takeaway, not just "chart" — for example "Bar chart: Q4 revenue up 18% over Q3, the largest quarterly rise of the year." For anything important, also include the underlying numbers as a short data table nearby, so the information is available to everyone regardless of whether they can see the chart. Prefer **SVG** where you can (it stays sharp at any size and scales with zoom); use **PNG** only where SVG isn't accepted.

### If I share the link, does that upload my data?

The chart tool does not upload the dataset to its server to create the link. It packs the data after `#` in the URL, which is excluded from the page's HTTP request. However, sending that complete link through email or chat shares the data with the recipient and potentially with that service. Treat the link as a copy of your dataset, not a private or password-protected chart. More on local processing in [why browser tools keep files private](/use-cases/why-browser-tools-keep-files-private).

The chart is built on your device. Exporting it or sharing a data-bearing link is your decision to share that information.
