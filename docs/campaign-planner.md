# Campaign planner

## Month navigation

The calendar header shows "‹ Month Year ›" with chevrons. The left
chevron is disabled when viewing the real current month — users can
navigate forward into future months but not backward into the past.

Each month carries its own seeded holiday hints and segment opportunity
hints, defined in `/data/calendar-hints.ts`. AI-generated campaigns
are scoped per-month — running the Plan with Vibe flow in April fills
April only; navigating to May shows May's own hints and an empty
campaign slate.

## The holiday opportunity nudges

The month calendar can show hardcoded **holiday opportunity** rows: a small red holiday name in the top-right of a date (when that date is a named holiday), with the same inline eyes + muted grey copy pattern as other nudges. Emphasis in copy uses a darker grey on wrapped segments, with no background on the message row.

## The segment opportunity nudges

Alongside holiday hints, the calendar also surfaces behavior-driven
opportunities — dates where the AI thinks you should act based on
customer-segment activity patterns, not the calendar.

December examples:

- **Dec 3 — Opportunity**: "30 days since you contacted **VIP customers**. Last touch Nov 3."
- **Dec 9 — Opportunity**: "Abandoned cart segment **growing fast**. 340 contacts idle."
- **Dec 17 — Opportunity**: "Loyal customers haven't heard from you in **60 days**."
- **Dec 22 — Opportunity**: "**128 new subscribers** in the last week. Welcome series not sent."

Visual treatment matches the holiday hint exactly (animated eyes +
muted grey copy, no background, no border), but the top-right tag is
"OPPORTUNITY" in purple instead of a red holiday name. Same visual
rhythm, different signal category.

Segment hints never block scheduled campaigns — they render below the
date and above any campaign pill. On a date that has both a campaign
AND a segment hint (e.g. Dec 22), the pattern shows "the AI scheduled
something here, but there's still another segment you haven't
addressed" — a useful signal that one campaign doesn't cover all
audiences.

When both a holiday and a segment hint exist on the same date, the
holiday tag is shown in the top-right (holidays are higher priority
context). Both messages render below.
