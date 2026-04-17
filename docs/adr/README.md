# Architecture Decision Records

Sequentially-numbered records of non-trivial technical decisions. Read in order to understand how the codebase arrived at its current shape.

## Index

- [0001 — Next.js App Router](./0001-nextjs-app-router.md)
- [0002 — shadcn/ui with Radix primitives and Nova preset](./0002-shadcn-ui-radix-nova.md)
- [0003 — Tailwind CSS v4](./0003-tailwind-v4.md)

## When to write a new ADR

Write one when:
- Choosing between two viable libraries or frameworks
- Adopting a non-obvious pattern
- Changing a convention mid-project
- Deciding NOT to do something common (and documenting why)

Don't write one for:
- Routine feature work that follows existing patterns
- Bug fixes
- Small refactors

## Numbering

Zero-padded to 4 digits, sequential: `0001-`, `0002-`, etc. Never renumber. Once an ADR is merged, it is immutable — new decisions that supersede it get new numbers, and the old ADR's status is updated to "Superseded by ADR-NNNN."

