# Project: Personal Finance Tracker (RN) — Interview Portfolio App

Portfolio project for a Senior/Mid-Senior React Native Engineer interview (code walkthrough). Evaluated on: reusable/testable components, design system, accessibility, mobile-first UX, and mobile performance (JS thread awareness). Depth of reasoning matters more than scope — every decision below should be one the author can defend live, so don't silently deviate from these conventions without flagging it.

## Stack

- React Native **CLI** (not Expo), TypeScript
- **React Query** for all server state — no Redux, no Zustand, unless a genuine screen-local shared-state need appears (not just "for showcase")
- No backend yet — `services/` return mocked data shaped exactly like a real API would return it (see conventions below). Treat every layer as if a real backend exists.

## Scope

1. **Home screen** — fully built (balance, spend-by-category, budget progress, recent transactions)
2. **New Transaction** (modal) — fully built (create flow, mutation)
3. **Transactions list** — lighter-depth screen, some decisions intentionally left open (see Open Decisions below)

## Folder Structure

```
src/
├── screens/
│   └── <ScreenName>/
│       ├── <ScreenName>.tsx
│       └── <ScreenName>.test.tsx
├── components/
│   └── <ComponentName>/
│       ├── <ComponentName>.tsx
│       ├── <ComponentName>.styles.ts
│       └── <ComponentName>.test.tsx      (sub-components used only by one parent nest inside that parent's folder)
├── hooks/           (flat, one file per query/mutation hook)
├── services/        (flat, one file per resource, mocked API calls)
├── types/           (flat, one file per resource — kept separate from services)
├── theme/           (colors, typography, spacing, index)
└── utils/           (cross-cutting pure functions: formatCurrency, formatRelativeDate, getCategoryMeta)
```

No `store/` (no Redux/Zustand). No barrel `index.ts` re-exports at this project size. No `assets/` beyond what's already used.

## Core Conventions (apply everywhere)

- **Money as integer cents** (`amountCents`), never floats. Format to display currency only at the presentation layer via `utils/formatCurrency.ts`.
- **Dates as ISO 8601 strings** in data/mocks. Format relative labels ("Today", "Yesterday") at render time via `utils/formatRelativeDate.ts` — never bake relative strings into mock data.
- **Signed/typed values encode meaning directly** — don't add a redundant `direction`/`type` boolean field when a signed number (e.g. `amountCents`) already implies it.
- **Color via semantic tokens** (`colorToken`, e.g. `category.food`, `status.warning`), never raw hex passed through data or components. The theme decides what a token renders as.
- **`StyleSheet.create` per component**, colocated with the component. Inline styles only for genuinely per-instance dynamic values (progress bar width, chart stroke color) — not a blanket ban, but the default is `StyleSheet`.
- **State classification discipline:** before adding state anywhere, classify it — server state (React Query), local/draft UI state (`useState`, e.g. form drafts, filter selections), or derived (`useMemo`, computed from other state — never stored separately). Don't default to lifting or globalizing state without a concrete cross-screen reason.
- **Query keys** should reflect what varies the fetch (e.g. `['transactions', { account, category, month }]` for filtered lists) so filter/param changes drive refetching through React Query's cache, not manual refetch logic.
- **Mutations invalidate every query key they actually affect**, not just the most obvious one. E.g. creating a transaction invalidates `transactions`, `balance`, AND `budgets` — think through the real data dependency graph before writing `invalidateQueries`.
- **Accessibility is part of each component's definition, not a follow-up pass.** A component isn't done until its `accessibilityRole`/`accessibilityLabel`/`accessibilityValue`/`accessibilityState` ship with its visual implementation.
- **Don't add a dependency or pattern to "showcase" it.** Every tool (a state library, a form library, an optimistic-update cache mutation) should be justified by the actual complexity present, not by wanting it to appear in the code. If in doubt, implement the simpler version and be ready to explain what would justify the more complex one.

## Component Patterns Already Established

- **`Card`**: shared layout primitive with optional `title` + `action` header prop (not a separate `SectionHeader` component — this was a deliberate merge, keep it merged).
- **`CardSkeleton`**: one generic, shape-configurable skeleton (`lines: { widthPercent, heightPx }[]`, optional `hasHeader`) reused by all cards — not bespoke skeletons per card. Shimmer via **Reanimated** (`useSharedValue` + `withRepeat(withTiming(...))`), not the legacy `Animated` API, so the animation runs on the UI thread. Skeletons are hidden from screen readers (`importantForAccessibility="no-hide-descendants"`); loading is announced once via a live region, not silently.
- **`CategoryBadge`**: two-letter initials in a colored circle, derived from `categoryId` via `utils/getCategoryMeta.ts`. Shared between `TransactionRow` (list context) and `CategoryTile` (selectable context, New Transaction). No `iconToken` field on transactions — badges are always category-derived.
- **List choice depends on content, not habit:** `ScrollView` for a small fixed set of heterogeneous sections (Home). `SectionList` for date-grouped, potentially long, homogeneous rows (Transactions list) — not a manually-grouped `FlatList`. `useInfiniteQuery` + `onEndReached` for pagination, not hand-rolled page state.
- **Forms:** plain `useState` per field is the default for forms this size (≤ ~6 fields, simple validation). Reach for `react-hook-form` only once field count, nested validation, or keystroke re-render cost genuinely justify it — don't add it preemptively.
- **Custom inputs** (e.g. `AmountInput` with live cents-based currency formatting) get their own component so formatting logic is unit-testable in isolation from the screen.

## Data Model Notes

- `Category` is its own reference entity (`getCategories()`), fetched once and joined by `categoryId` elsewhere (transactions, budgets) — not denormalized inline everywhere. Exception: `CategorySpend` (in the spend-by-category response) carries `label`/`colorToken` inline since that response is inherently category-specific.
- `BudgetProgress.status` ('under' | 'warning' | 'over') is **server-computed**, not derived client-side from `spent > limit` — keeps the business rule (what counts as "near limit") in one place and keeps `BudgetProgressRow` a simple status→token lookup.
- `CategorySpend.percentage` is **API-provided**, not computed client-side from amounts, to avoid rounding/edge-case bugs being reimplemented per-client.
- `CreateTransactionPayload.amountCents` is always **positive** (sign is applied based on the `type: 'expense' | 'income'` field), even though the read-side `Transaction.amountCents` is signed. Don't conflate the create and read shapes.

## Performance Defaults

- `React.memo` on card/row components that repeat or that sit beside frequently-changing siblings.
- `useMemo` for derived/computed data (chart angles, sorted/totaled arrays), `useCallback` for handlers passed into memoized children.
- Don't reach for `FlatList`/virtualization on small, fixed, heterogeneous content (Home's four cards, New Transaction's 9-tile grid) — that's a "why NOT" answer, not an oversight.
- Any looping/entrance animation uses Reanimated (UI thread), never a JS-driven loop.

## Open Decisions (Transactions List — intentionally not fully resolved)

Flag rather than silently assume when touching these:
- Filter UI behavior (multi-select vs. single-select categories, month picker × pagination interaction)
- Empty states for filtered views with no results
- Whether filters persist across screen re-entry or reset

## Explicit Rejections (don't reintroduce without a new justification)

- Redux/Zustand for Home or New Transaction's form/read state — rejected as unjustified given no cross-screen shared/mutated state exists yet.
- A separate `SectionHeader` component — merged into `Card` as an optional prop.
- Optimistic updates on `useCreateTransaction` — designed and understood, but not implemented; plain invalidate-and-refetch used instead given the added complexity (manual cache manipulation, rollback, temp-id reconciliation) wasn't worth it for this project's scope/timeline.
