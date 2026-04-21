# Chart artifact

The `ChartArtifact` component wraps a chart inside the standard artifact
shell used in assistant responses. It supports three chart types (bar,
line, pie) toggled via a segmented control in the header.

## When to use

Embed a `ChartArtifact` inside an assistant response any time the
answer involves comparing values across a set of labels — campaign
performance, agent load, metric over time, distribution of outcomes.

Do NOT embed for:
- Single values (use a paragraph with bolded numbers instead)
- Very large datasets (>20 labels — offer a link to a full view)
- Data that has no meaningful visual pattern (a flat line says nothing)

## Data shape

```ts
type ChartDatum = {
  label: string
  value: number
  status?: 'strong' | 'good' | 'normal' | 'weak'
}
```

- `label`: string shown on the X axis (bar/line) or as a slice label (pie)
- `value`: numeric value
- `status`: optional — drives the color. If omitted, defaults to 'good'

## Color palette (by status)

| Status | Color    | Meaning                                  |
|--------|----------|------------------------------------------|
| strong | `#0a84ff`| Outperforming baseline                    |
| good   | `#5aaaff`| Within normal range, trending well        |
| normal | `#bfd8f5`| Neutral, no signal                        |
| weak   | `#f0a6a0`| Underperforming, needs attention          |

## Using inside an assistant response

Add a `chart` block to the blocks array:

```ts
{
  role: 'assistant',
  blocks: [
    { type: 'p', text: 'Here's the weekly trend:' },
    {
      type: 'chart',
      title: 'First-response time by day',
      data: [
        { label: 'Mon', value: 34, status: 'good' },
        { label: 'Sat', value: 252, status: 'weak' },
      ],
      // optional — defaults to 'bar'
      defaultType: 'bar',
    },
    { type: 'p', text: 'As you can see, weekends are the problem.' },
  ]
}
```

## Default chart type

Use this guidance when picking `defaultType`:

- `bar` — comparing values across discrete labels (campaigns, agents, days)
- `line` — a value changing across a continuous axis (time series)
- `pie` — showing distribution or share of a whole (3-6 slices max)

The user can always switch via the header control. Pick the one that
best answers the question the assistant is responding to.

## Sizing

Component fills its container (`width: 100%`). Inside the conversation
column (680px), the chart renders at 680 × 320. The body area is fixed
at 260px high so the chart maintains a consistent ratio across types.

## Tab control

The Bar / Line / Pie tabs are icon-only (lucide-react icons). Active
tab has a white background and subtle shadow. Tabs are `role="tab"`
with proper `aria-selected` for accessibility, and each has an
`aria-label` naming the chart type.
