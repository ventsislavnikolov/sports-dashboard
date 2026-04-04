# Football Live Dashboard — Design Spec

**Codename:** CIRIOLAJI
**Date:** 2026-04-04
**Status:** Approved

---

## Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite |
| Framework | React 19 (SPA) |
| Routing | TanStack Router — file-based, type-safe |
| Data Fetching | TanStack Query — `refetchInterval` for live polling |
| State | TanStack Store — active fixture + selected player |
| Styling | Tailwind CSS v4 — CSS-first config, dark theme |
| Charts | Recharts — horizontal bar for shot comparison |
| API Mocking | MSW (Mock Service Worker) — browser mode in dev |
| Unit Testing | Vitest + @testing-library/react |
| E2E Testing | Playwright |
| Deployment | Vercel — static SPA |

**API:** API-Football v3 (`https://v3.football.api-sports.io`)

---

## Architecture

Feature-sliced with colocated queries. Each feature owns its components, hooks, and utilities. Shared API client and types live in `src/api/`.

```
src/
  routes/
    __root.tsx              # Layout shell: sidebar + main area
    index.tsx               # Home — no fixture selected
    fixture/
      $fixtureId.tsx        # Fixture detail — syncs ID to store
  features/
    sidebar/
      Sidebar.tsx           # Container, expand/collapse
      LeagueFilter.tsx      # Chip filter row
      MatchList.tsx          # Grouped fixture list
      MatchItem.tsx          # Single match row
      useLiveFixtures.ts    # GET /fixtures?live=all, 15s poll
    match-cards/
      TopLeaderboardCard.tsx # Generic top-5 card (passes/tackles/dribbles)
      sortPlayers.ts         # Sort + extract top 5 by stat
      useFixturePlayers.ts   # GET /fixtures/players, 15s poll
    team-stats/
      TeamStatsCard.tsx      # Home | label | away layout
      useFixtureStats.ts     # GET /fixtures/statistics, 15s poll
    player-detail/
      PlayerDetailCard.tsx   # Reads from useFixturePlayers cache
    shot-compare/
      ShotCompareCard.tsx    # Recharts horizontal bar chart
  shared/
    CardShell.tsx            # Card wrapper with loading/error/stale states
    PlayerAvatar.tsx         # Photo with initials fallback
    LiveBadge.tsx            # Green pulsing LIVE indicator
    StatRow.tsx              # Reusable stat label + value row
    formatMinute.ts          # Elapsed minute formatting
  api/
    client.ts                # Fetch wrapper, x-rapidapi-key header
    types.ts                 # All TypeScript interfaces
  store/
    activeFixture.ts         # TanStack Store: fixtureId, selectedPlayerId, comparedPlayerIds
  mocks/
    handlers.ts              # MSW request handlers
    fixtures/                # Snapshot JSON response files
    browser.ts               # MSW browser setup
```

---

## Routing

| Route | Purpose |
|-------|---------|
| `/` | Dashboard home. No fixture selected. Shows "Select a match" in main area. |
| `/fixture/$fixtureId` | Fixture detail. Parses ID from URL, syncs to TanStack Store, enables fixture queries. |

Clicking a match in the sidebar navigates via TanStack Router. Direct URL access works as a permalink. Navigating to `/` clears the store.

---

## Layout

```
┌─────────────┬──────────────────────────────┐
│             │  Match Header (if fixture)   │
│  Sidebar    ├──────────────────────────────┤
│  260px      │                              │
│  (collapse  │  Card Grid (2-col CSS Grid)  │
│   to 60px)  │  14px gap                    │
│             │                              │
└─────────────┴──────────────────────────────┘
```

- **Sidebar:** fixed-position, full viewport height, 260px expanded / 60px collapsed
- **Collapse toggle:** chevron button at sidebar top, preference stored in `localStorage`
- **Auto-collapse:** at 1280px viewport width, sidebar collapses automatically
- **Collapsed state:** score + minute only, no team names or league headers
- **Main area:** `flex flex-col`, remaining width
- **Match header:** sticky within main area when fixture is selected
- **Card grid:** CSS Grid, 2 equal columns, 14px gap, scrollable

---

## Sidebar

### LeagueFilter
- Horizontal chip row at sidebar top
- "All" chip always present + one chip per distinct league in current live data
- Active chip: filled `accent-blue`, inactive: `bg-hover` with `text-muted`
- Filter state is local `useState`, not in the store

### MatchList
- Groups fixtures by `league.name`, renders section headers
- Derives available leagues from fixture data: `Array.from(new Set(...))`

### MatchItem
- Displays: home name, score, away name, elapsed minute (`+N'` in green), LIVE dot
- Active match: `border-left: 2px solid accent-blue`, `bg-hover` background
- Click navigates to `/fixture/{id}`

### Collapsed sidebar
- Shows only score + minute per match
- Active match highlighted with blue left border
- Expand chevron at top

### States
- **Loading:** 4 skeleton match rows with shimmer animation
- **Error:** inline retry message
- **Empty:** "No live matches right now" centered

---

## Dashboard Cards

### CardShell (shared wrapper)
All cards are wrapped in `CardShell` which provides:
- Consistent styling: `bg-surface`, rounded corners, padding
- Props: `title`, `children`, `dataUpdatedAt`, `isLoading`, `error`, `onRetry`
- "Updated Ns ago" timestamp from `dataUpdatedAt`
- Stale indicator: amber dot on title if last fetch > 30s ago
- Loading: skeleton shimmer
- Error: red-bordered card with retry button

### Top 5 Leaderboard (generic)
- Single `TopLeaderboardCard` component with `stat: 'passes' | 'tackles' | 'dribbles'` prop
- Three instances rendered in the card grid
- Uses `sortPlayers(players, stat)` to extract top 5 (null/0 values excluded)
- Row: rank number, `PlayerAvatar`, full name, team colour dot, stat value in `accent-blue`
- Clicking a row sets `selectedPlayerId` in the store

### Team Stats
- Three-column layout: home value | stat label | away value
- Stats: Possession %, Shots, Shots on Target, Passes, Fouls, Yellow Cards, Corners
- Higher value highlighted in `accent-blue`
- Own hook `useFixtureStats()` with independent 15s polling

### Player Detail
- Triggered by `selectedPlayerId` from store
- Reads from `useFixturePlayers` query cache — no additional API call
- Spans 2 grid columns (`grid-column: span 2`)
- Displays: jersey number, name, position, nationality
- Rating badge: green (>=7), amber (>=6), red (<6)
- Stat grid: Shots, Passes, Tackles, Interceptions, Dribbles, Pass Accuracy %
- Empty state: "Click a player to see details"

### Shot Compare
- Two player slots tracked by `comparedPlayerIds` in the store
- Clicking any player row fills the next empty slot; clicking again removes
- Recharts `BarChart` with horizontal layout
- Two bars per player's shot count, scaled relative to match maximum
- Fewer than 2 players: instruction text shown

---

## Data Layer

### API Client (`src/api/client.ts`)
- Thin fetch wrapper reading `VITE_API_FOOTBALL_KEY` and `VITE_API_BASE_URL` from env
- Sets `x-rapidapi-key` header
- Typed functions: `fetchLiveFixtures()`, `fetchFixturePlayers(fixtureId)`, `fetchFixtureStats(fixtureId)`
- All endpoints in a single file (API surface is small)

### Types (`src/api/types.ts`)
- `Fixture`, `Team`, `Score`, `PlayerMatchStat`, `TeamMatchStats` from PRD Section 6
- `ApiResponse<T>` wrapper with `get`, `results`, `errors` fields

### TanStack Query Configuration

| Hook | Endpoint | refetchInterval | staleTime | enabled |
|------|----------|----------------|-----------|---------|
| `useLiveFixtures` | `/fixtures?live=all` | 15s | default | always |
| `useFixturePlayers` | `/fixtures/players?fixture={id}` | 15s | default | `!!fixtureId` |
| `useFixtureStats` | `/fixtures/statistics?fixture={id}` | 15s | default | `!!fixtureId` |

All hooks: `refetchIntervalInBackground: false`

### TanStack Store (`src/store/activeFixture.ts`)
```typescript
{
  fixtureId: number | null
  selectedPlayerId: number | null
  comparedPlayerIds: [number | null, number | null]
  setFixtureId: (id: number) => void
  setSelectedPlayerId: (id: number | null) => void
  toggleComparedPlayer: (id: number) => void
  // toggleComparedPlayer: if player is already in a slot, remove them.
  // Otherwise, fill the first empty slot. If both slots are full, replace slot 0.
}
```

### MSW Mocking
- `src/mocks/handlers.ts` — request handlers for all 3 endpoints
- `src/mocks/fixtures/` — snapshot JSON files with realistic response data
- `src/mocks/browser.ts` — MSW browser worker setup
- Activated in `src/main.tsx` when `VITE_USE_MOCKS === 'true'`
- Same handlers reused in Vitest tests

---

## Styling

### Colour Tokens (CSS variables via Tailwind v4 `@theme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0D1117` | Page background, sidebar |
| `--color-bg-surface` | `#161B22` | Cards, panels |
| `--color-bg-hover` | `#21262D` | Hover states, dividers |
| `--color-accent-blue` | `#58A6FF` | Active match, stat values, links |
| `--color-accent-green` | `#3FB950` | LIVE dot, positive stats, rating >= 7 |
| `--color-accent-red` | `#F78166` | Cards, negative deltas, rating < 6 |
| `--color-accent-purple` | `#B388F8` | Dribble stat accent |
| `--color-text-primary` | `#E6EDF3` | Main body text |
| `--color-text-muted` | `#8B949E` | Labels, metadata, timestamps |

### Typography
- **Font:** Inter (Google Fonts CDN), `system-ui` fallback
- **Card titles:** 12px, 700, uppercase, letter-spacing 0.8px, `text-muted`
- **Stat values:** 14-22px, 700-800, `accent-blue`
- **Player names:** 12px, 600, `text-primary`
- **Metadata:** 10px, 400, `text-muted`

### Component States
- **Loading:** skeleton shimmer (`bg-surface` with opacity pulse)
- **Error:** inline red-bordered card with Retry button
- **Empty:** centered muted message
- **Stale:** amber dot on card title if last fetch > 30s ago

---

## Testing

### Vitest — Unit Tests
- `src/api/__tests__/client.test.ts` — headers, error handling
- `src/features/match-cards/__tests__/sortPlayers.test.ts` — sorting, nulls, ties, empty arrays
- `src/features/sidebar/__tests__/useLiveFixtures.test.ts` — grouping, league derivation, loading/error
- `src/shared/__tests__/formatMinute.test.ts` — formatting, edge cases
- Hooks tested with `@testing-library/react` `renderHook` + QueryClient wrapper
- MSW handlers reused from `src/mocks/`

### Playwright — E2E Tests
- `e2e/sidebar.spec.ts` — sidebar loads, filters work, match click navigates
- `e2e/dashboard.spec.ts` — match selection populates cards, player click opens detail
- `e2e/permalink.spec.ts` — direct `/fixture/{id}` URL loads correctly
- MSW in browser for test isolation
- Viewport: 1280px (AC-09 validation)

---

## Build & Deployment

### Vite Config
- React plugin + TanStack Router plugin (file-based routing)
- `@tailwindcss/vite` plugin for Tailwind CSS v4
- Path alias: `@/` → `src/`

### Environment Variables
- `VITE_API_FOOTBALL_KEY` — API-Football API key
- `VITE_API_BASE_URL` — `https://v3.football.api-sports.io`
- `VITE_USE_MOCKS` — `true` to enable MSW in dev
- `.env.example` committed, `.env` gitignored

### Scripts
- `dev` — `vite`
- `build` — `tsc && vite build`
- `preview` — `vite preview`
- `test` — `vitest`
- `test:e2e` — `playwright test`
- `lint` — `eslint .`

### Vercel
- Framework preset: Vite
- Build: `vite build`, output: `dist`
- Env vars in Vercel dashboard
- Pure static SPA, no server functions

---

## Acceptance Criteria Mapping

| AC | How addressed |
|----|--------------|
| AC-01 | `useLiveFixtures` polls every 15s, sidebar renders on first response |
| AC-02 | `LeagueFilter` chips filter `MatchList` by league |
| AC-03 | Fixture route enables `useFixturePlayers` + `useFixtureStats`, cards render on data |
| AC-04 | `refetchInterval: 15_000` on `useFixturePlayers` |
| AC-05 | `PlayerDetailCard` reads from `useFixturePlayers` query cache |
| AC-06 | Max 3 polling queries: live fixtures + fixture players + fixture stats |
| AC-07 | `CardShell` handles error state per card with retry |
| AC-08 | Strict TypeScript, no `any`, `tsc --noEmit` in build script |
| AC-09 | Sidebar auto-collapses at 1280px viewport |
| AC-10 | Vercel static deployment with env vars |
