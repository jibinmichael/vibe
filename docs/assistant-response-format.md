# Assistant response formatting

When Claude returns a response that will be rendered inside `AssistantRow`,
it should return an array of structured blocks — not a single string of
markdown. The rendering component parses each block as a distinct
typography role.

## Block schema

```ts
type AssistantBlock =
  | { type: 'lead'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string; cite?: { label: string; url?: string } }
  | { type: 'list'; items: string[] }
  | { type: 'numbered'; items: string[] }
```

## When to use each role

### `lead`
One sentence, maximum two. Appears at the very top of a response when the
answer has a clear summary worth giving up front. Skip this for short
responses — don't invent a summary just to fill the slot.

### `h2`
Major sections inside a long response. Use sparingly — a well-structured
answer typically has 2–4 `h2` sections. Label each section with the
question it answers, not the topic name.

Good: "Where the drop is coming from", "The root cause"
Bad: "Analysis", "Details"

### `h3`
Sub-sections inside an `h2`. Only use if the `h2` section has 3+
paragraphs that genuinely fall into distinct sub-topics.

### `p`
The default. Body paragraphs.

**Inline marks supported inside `text`:**
- `**bold**` — named entities, key metrics, things the reader should notice
- `*italic*` — emphasis, operation names, foreign terms

Overuse kills the signal. Three to five bolds per paragraph is the ceiling.

### `list`
Unordered list. Use when items are parallel and order doesn't matter.
Each item should be a fragment or short sentence, not a paragraph.

### `numbered`
Ordered list. Use when order matters or when the reader will refer back
to specific items by number.

### `cite`
Attach a citation to a specific paragraph when the claim is
source-dependent. The chip renders inline at the end of the paragraph.
Don't cite things like "this week's response times" that come from the
product's own data.

## Rules

1. **Every response must render cleanly with just `p` blocks.** Other
   roles are enhancements, not requirements. If you're unsure whether a
   heading is needed, it isn't.

2. **Don't use `h2` to break up a short answer.** If the full response
   fits in 3 paragraphs, use 3 `p` blocks and nothing else.

3. **Specific numbers belong in `p` blocks, not headings.** Headings are
   for navigation, not data.

4. **`lead` is optional.** Only include when the answer genuinely has a
   summary worth hoisting to the top.

5. **Bold named entities and key numbers.** Names of people, campaigns,
   and metric names ("CX score", "FRT") read better bolded on first
   mention. Don't re-bold them on subsequent mentions.

6. **One idea per paragraph.** If a paragraph has two distinct claims,
   split it. Forcing the reader through long blocks fights the
   structured format.

## Example

```ts
{
  role: 'assistant',
  blocks: [
    { type: 'lead', text: 'Your **CX score dropped 8 points** this week...' },
    { type: 'h2', text: 'Where the drop is coming from' },
    { type: 'p', text: 'Only **first-response time** moved significantly.' },
    { type: 'numbered', items: [
      '**Weekend FRT:** 4h 12m this week, up from 1h 38m.',
      '**Weekday FRT:** stable at ~32 minutes.',
    ]},
  ]
}
```

## Checklist before returning a response

- [ ] Does every `h2` label the section by the question it answers?
- [ ] Are bolds limited to named entities and key numbers?
- [ ] Is each paragraph one idea?
- [ ] Would a simpler response (just `p` blocks) serve the reader better?
- [ ] Are citations tied to the correct paragraph?
