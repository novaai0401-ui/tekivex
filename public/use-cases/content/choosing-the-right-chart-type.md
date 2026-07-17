Most bad charts aren't bad because of colors or fonts — they're bad because the *shape* of the chart doesn't match the question the data is supposed to answer. A pie chart asked to show a trend, a line chart asked to compare categories, a 3D bar chart asked to do anything at all. The good news is that choosing well doesn't require design talent. It requires asking one question first, and then following a handful of rules that visualization research settled decades ago.

## Start with the question, not the data

Before touching a chart menu, finish this sentence: *"I want the reader to see…"* Almost every answer falls into one of five families:

1. **Comparison** — which category is bigger? (sales by region, errors by service)
2. **Trend** — how does something change over time? (revenue by month, temperature by hour)
3. **Part-to-whole** — how does something divide up? (budget by department, market share)
4. **Distribution** — how are values spread? (response times, exam scores)
5. **Relationship** — do two things move together? (price vs. rating, age vs. income)

Each family has a best-fit chart, and the fit comes from how human perception works: we judge *positions along a common scale* very accurately, *lengths* well, and *angles and areas* poorly. The strongest charts encode the important numbers as positions and lengths; the weakest ask you to compare angles and areas.

## Comparison → bar chart

For comparing categories, the bar chart is nearly unbeatable, precisely because it encodes every value as a length from a common baseline. Two rules keep it honest:

- **Bars must start at zero.** A bar's message *is* its length; truncating the axis makes a 3% difference look like a 3× difference. (Line charts are exempt from this rule — more below.)
- **Horizontal bars beat vertical when labels are long.** Category names read naturally beside horizontal bars instead of rotating 45° beneath vertical ones. Sorting bars by value, rather than alphabetically, turns the chart into an instant ranking.

If you're comparing categories *across groups* (sales by region, split by year), grouped bars work up to two or three groups. Beyond that, consider **small multiples** — a grid of identical mini-charts, one per group. They scale far better than one chart with twelve clustered bars.

## Trend → line chart

Time on the horizontal axis, value on the vertical, points connected: the line chart's slope makes change itself visible. Guidance that matters in practice:

- A line implies continuity, so connect points only when the quantity is continuous through time. Monthly revenue: yes. Values of unrelated categories: no — that's a bar chart wearing a disguise.
- **Line charts may start above zero.** Their message is the slope, not the height, and forcing a zero baseline can flatten meaningful variation into a horizontal stripe. Do it deliberately, and label the axis clearly.
- Beyond four or five lines, a chart becomes "spaghetti." Highlight the one or two series the story is about and grey out the rest, or split into small multiples.

An **area chart** is a line chart with the space below filled. Use it when the *amount* (not just the trend) matters, and stack areas only when the total is meaningful and the parts are few — reading the middle layers of a stacked area chart is notoriously hard because each one rides on the wobble of those beneath it.

## Part-to-whole → pie, but on strict conditions

Pie charts are perception's worst case — they encode values as angles and areas, which humans misjudge. Quick test: can you rank four unlabeled pie slices of 24%, 22%, 28%, and 26%? Almost nobody can; as bars, it's effortless.

That said, pies are honest in one narrow role: showing that *one thing dominates* or that a whole splits into a *few* parts. The conditions:

- The parts must sum to a meaningful 100%.
- Five slices or fewer; combine the rest into "Other."
- Label slices directly with values; don't make readers decode a legend by color.
- One pie only — comparing values *across* multiple pies is nearly impossible. Use a bar chart or stacked bars instead.

A **donut chart** is a pie with a hole; perceptually it's the same, and the hole is a decent spot for the total. If the parts matter more than the whole, skip the circle entirely and use a bar chart with percentages.

## Distribution → histogram

A histogram looks like a bar chart but answers a different question: it divides a numeric range into bins and shows how many values fall in each, revealing the shape of the data — symmetric or skewed, one hump or two, outliers or none. Averages hide these shapes; a support team with a 2-minute *average* response time may actually have two clusters at 30 seconds and 9 minutes, which is a different story entirely.

The bin width is the whole game: too many bins gives noise, too few erases the shape. Try a few widths — real patterns survive rebinning, artifacts don't. For comparing distributions across several groups, box plots offer a compact five-number summary per group.

## Relationship → scatter plot

To ask whether two measures move together, plot every record as a dot: one measure horizontal, the other vertical. Patterns leap out — upward drifts, curves, clusters, and the outliers that are often the most interesting rows in the dataset. Correlation isn't causation, of course; the scatter plot shows *that* things move together, never *why*. When many dots overlap, shrink them or make them translucent so density stays visible.

## The mistakes that do the most damage

- **3D effects.** Perspective distorts every comparison the chart exists to support — rear bars shrink, pie slices near the viewer inflate. No exceptions worth keeping.
- **Truncated bar axes.** The classic way charts lie. Bars start at zero, full stop.
- **Dual y-axes.** Two different scales on one chart let you "prove" almost anything by stretching either axis. Two stacked panels sharing an x-axis say the same thing without the sleight of hand.
- **Color as decoration.** Color should mean something: one hue per series, an accent to highlight the point, grey for context. A different color for every bar of the same series is noise. And since roughly 1 in 12 men has some color-vision deficiency, never let a red-vs-green distinction carry the message alone — pair it with labels or position.
- **Charting everything.** A dataset with three numbers is a sentence, not a chart. Charts earn their space when there's a shape, trend, or comparison a sentence can't convey.

## A decision path you can memorize

**Comparing categories** → bar (sorted, zero-based). **Change over time** → line. **Parts of a whole, ≤5 parts** → pie or stacked bar; more parts → bar with percentages. **Shape of one measure** → histogram. **Two measures together** → scatter. When a chart feels crowded → small multiples. When in doubt → bar chart; it's the format your reader decodes most accurately.

That's genuinely most of the craft. If you want to test these choices against your own data, any modern spreadsheet works — or drop a CSV into a [free in-browser chart tool](/tools/csv-to-chart) and try the same data as a bar, line, and donut to see which one makes the story obvious. The right chart type is the one where the reader stops noticing the chart and just sees the answer.
