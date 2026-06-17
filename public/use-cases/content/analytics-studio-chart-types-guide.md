A chart library with 26+ types is a gift and a trap. The gift is that almost any relationship in your data has a visualization that fits it well. The trap is that having a sankey diagram available does not mean your data wants to be a sankey diagram. The most common failure in data visualization is not a missing chart type — it is the wrong chart type chosen because it looked impressive.

Analytics Studio ships bar, line, scatter, radar, heatmap, treemap, sankey, and many more, all reading from the same in-memory dataset and pivot. That breadth is only useful if you can map a question to a chart quickly and confidently. The good news is that almost every analytical question falls into one of six families, and each family has a default answer plus a couple of well-understood alternatives.

This guide organizes the catalog by the question you are trying to answer — comparison, trend, distribution, part-to-whole, relationship, and flow — gives a lookup table you can keep nearby, and closes with the pitfalls that quietly mislead readers.

## Start with the question, not the chart

Before choosing a visualization, name the question in one sentence. "Which region sells most?" is a comparison. "Is revenue growing?" is a trend. "How are deal sizes spread?" is a distribution. The phrasing points almost unambiguously at a chart family. Picking the chart first and fitting the question to it is how dashboards end up with three pie charts that should have been one bar chart.

In Analytics Studio the builder nudges you in the right direction — drag a date and a measure and it suggests a line chart — but the judgment is still yours. The families below are the mental model to bring.

## Comparison: bar, column, grouped bar, radar

When you are ranking or comparing discrete categories, the bar chart is almost always correct and almost never wrong. Horizontal bars read best when category labels are long or numerous; vertical columns suit a small set with short labels. For comparing the same categories across a second dimension, use grouped or stacked bars.

Radar charts deserve a careful note. They are excellent for comparing a few entities across several shared, comparable metrics — a product scored on 5 to 7 attributes, for instance. They become unreadable with many series or with axes measured in different units, so reserve them for the narrow case they shine in.

## Trend: line, area, multi-series line

Anything measured over time is a trend, and the line chart is the default. The continuous line encodes the one thing a bar chart cannot: that the points are connected and the spaces between them are meaningful. Use an area chart when the cumulative magnitude matters as much as the shape, and a multi-series line when comparing trends across a few categories.

```tsx
import { Chart } from "@tekivex/analytics-studio";

<Chart
  type="line"
  data={pivot}
  x={{ field: "orderedAt", scale: "time" }}
  y={{ field: "revenue", agg: "sum" }}
  series="region"   // one line per region
/>;
```

Resist the urge to stack many series in one area chart; beyond two or three bands the layers occlude each other and the trend you cared about disappears.

## Distribution: histogram, box plot, scatter

Distribution questions ask about spread, shape, and outliers rather than a single summary number — and this is where teams most often reach for the wrong tool. A bar chart of an average hides the very thing you are asking about. A histogram shows the shape of a single variable; a box plot compares spread across categories compactly; a scatter plot shows the joint distribution of two variables and exposes clusters and outliers a summary would erase.

## Part-to-whole: stacked bar, treemap, pie (sparingly)

When the question is "what share does each part contribute," you have a part-to-whole problem. For a single breakdown the honest default is a stacked bar or a simple share-of-total bar, not a pie — humans compare lengths far more accurately than angles.

Treemaps are the standout here for hierarchical part-to-whole data. When categories nest (region to country to city, or category to subcategory to product) and you care about relative size, a treemap packs hundreds of weighted rectangles into a single readable view that a pie or bar simply cannot.

```tsx
<Chart
  type="treemap"
  data={pivot}
  group={["category", "subcategory"]}   // nesting defines the hierarchy
  size={{ field: "revenue", agg: "sum" }}
  color={{ field: "margin", agg: "mean", scale: "diverging" }}
/>;
```

Reserve pie charts for the genuine two-or-three-slice case where the whole is obviously 100% and precision does not matter.

## Relationship: scatter, bubble, heatmap

To show how two or more variables move together, use a scatter plot; add a third variable as point size and it becomes a bubble chart. For relationships between two categorical dimensions measured by a value — a cohort retention grid, a day-by-hour activity matrix — a heatmap is the right encoding. Color intensity across a grid reveals patterns that no bar or line arrangement of the same data would surface.

## Flow: sankey

Flow is the family most people do not realize they have. When quantities move between states — traffic sources to landing pages to conversions, budget from departments to projects, users between funnel stages — a sankey diagram shows both the volume of each flow and where it splits or merges. It answers "where does it go and how much" in a way bars across separate stages cannot, because it preserves the connection between stages.

## Data question to chart type

| Your question | Family | First choice | Alternatives |
|---------------|--------|--------------|--------------|
| Which category is biggest? | Comparison | Bar / column | Grouped bar |
| Compare entities on several metrics? | Comparison | Radar | Grouped bar |
| Is this growing over time? | Trend | Line | Area |
| How is one variable spread? | Distribution | Histogram | Box plot |
| Spread across categories? | Distribution | Box plot | Scatter |
| What share does each part hold? | Part-to-whole | Stacked bar | Treemap, pie (2-3 slices) |
| Nested / hierarchical shares? | Part-to-whole | Treemap | Sunburst |
| Do two variables relate? | Relationship | Scatter | Bubble |
| Pattern across two dimensions? | Relationship | Heatmap | — |
| Where do quantities flow? | Flow | Sankey | — |

## Common pitfalls

A handful of mistakes account for most misleading charts:

- **Truncated axes.** Starting a bar chart's value axis above zero exaggerates differences. Bars encode magnitude by length; cut the baseline and the encoding lies. Line charts can start above zero, bars cannot.
- **Pie charts with many slices.** Past three or four wedges, comparison by angle collapses. Switch to a bar.
- **Dual y-axes.** Two metrics on two scales in one chart invite spurious correlation; the apparent crossover is an artifact of how you scaled the axes.
- **Rainbow heatmaps.** Use a single sequential or diverging color ramp. A rainbow palette creates false boundaries where the data is smooth.
- **Stacking too many series.** Beyond a few bands, stacked areas and bars become impossible to read above the baseline layer.

## When to use which chart

Match the chart to the question's family first, then pick the simplest member of that family that answers it. Bars for comparison, lines for trends, histograms and box plots for distribution, stacked bars and treemaps for part-to-whole, scatter and heatmaps for relationships, sankey for flow. Reach for the exotic types — radar, treemap, sankey, heatmap — only when their specific strength matches your question, not for visual novelty.

## Key takeaways

The value of 26+ chart types is not that you will use all of them — it is that whatever question your data poses, the right encoding exists. Start from the question, identify its family, and let the defaults guide you, deviating only with reason. Avoid the handful of pitfalls that distort otherwise-correct charts.

Every chart type reads from the same pivot and dataset, so swapping encodings to test a story costs nothing. See them live on the [product page](/product/analytics-studio), drop them into a [drag-and-drop dashboard](/use-cases/analytics-studio-drag-drop-dashboards), or browse the full [use cases hub](/use-cases) for more.
