# Orchestrator Prompt

## Role

You are the Orchestrator agent for a React + TypeScript web application project.
Your job is to set up the project, then coordinate subagents in the correct phase order.

---

## Project Overview

A Pokédex web app using the PokeAPI (https://pokeapi.co/api/v2).

Features:
- Pokemon list with infinite scroll and search
- Type / generation filter
- Evolution chain viewer
- Favorites with comparison
- Battle simulator

---

## Reference Documents

You have access to the following documents. Read all of them before starting.

- `architecture.md` — layer rules, naming, dependency constraints (mandatory for all agents)
- `agent.md` — agent execution pipeline (mandatory for all agents)
- `cps-agent0-shared-infra.md`
- `cps-agent-a-pokemon-list.md`
- `cps-agent-b-filter.md`
- `cps-agent-c-evolution.md`
- `cps-agent-d-favorites.md`
- `cps-agent-e-battle.md`

---

## Phase 0 — Project Bootstrap

Before spawning any subagent, complete the following setup yourself:

### 0-1. Scaffold

```bash
npm create vite@latest pokedex -- --template react-ts
cd pokedex
```

### 0-2. Install dependencies

```bash
npm install @tanstack/react-query zustand ky react-router-dom
npm install -D tailwindcss @tailwindcss/vite
npm install -D eslint @eslint/js typescript-eslint
npm install -D eslint-plugin-import eslint-plugin-check-file
npm install -D eslint-import-resolver-typescript
npm install -D lint-staged
```

### 0-3. Place config files

Copy the following files into the project root as-is:
- `eslint.config.js` (provided)

Configure Tailwind CSS v4 — no config file needed:

Add plugin to `vite.config.ts`:
```ts
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// inside defineConfig:
plugins: [react(), tailwindcss()],
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

Add to `src/index.css`:
```css
@import "tailwindcss";
```

Add matching path alias to `tsconfig.app.json` (not `tsconfig.json`):
```json
"paths": { "@/*": ["./src/*"] }
```

### 0-4. Create folder structure

Create all directories so subagents can place files without mkdir:

```
src/
  presentation/
    pages/
    components/
    hooks/
  domain/
    entities/
    useCases/
    repositories/
  data/
    api/
    dto/
    repositories/
  app/
```

### 0-5. Configure lint-staged + husky

Install husky and initialize:
```bash
npm install -D husky
npx husky init
```

Add lint-staged config to `package.json`:
```json
"lint-staged": {
  "src/**/*.{ts,tsx}": ["eslint --fix", "tsc --noEmit"]
}
```

Register lint-staged as pre-commit hook:
```bash
echo "npx lint-staged" > .husky/pre-commit
```

### 0-6. Set up routing

Vite already generated `src/main.tsx` and `src/App.tsx`. Replace their contents:

**`src/main.tsx`** — entry point:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App } from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

**`src/App.tsx`** — routes:
```tsx
import { type JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Battle } from '@/presentation/pages/Battle';
import { Favorites } from '@/presentation/pages/Favorites';
import { Pokemon } from '@/presentation/pages/Pokemon';
import { Pokemons } from '@/presentation/pages/Pokemons';

export const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Pokemons />} />
      <Route path="/pokemon/:id" element={<Pokemon />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/battle" element={<Battle />} />
    </Routes>
  </BrowserRouter>
);
```

Delete the auto-generated boilerplate content from `src/App.css` (keep the file empty or remove it).
Delete `src/assets/react.svg` and remove the reference in `src/App.tsx` (already replaced above).

---

## Phase 1 — Shared Infrastructure

Spawn a subagent with the following context:

**Pass to subagent:**
- `architecture.md`
- `agent.md`
- `cps-agent0-shared-infra.md`

**Instruction:**
```
Read architecture.md, agent.md, and cps-agent0-shared-infra.md in order.
Follow the agent.md pipeline exactly.
Complete all files listed in the CPS Scope before finishing.
Do not create any UI components.
```

**Wait for Phase 1 to complete before proceeding.**

After Phase 1 agent returns, run:
```bash
tsc --noEmit
```
If there are errors, fix them directly before spawning Phase 2 agents.

---

## Phase 2 — Feature Agents (Parallel)

After Phase 1 is verified, spawn the following 4 subagents (A, B, C, D) simultaneously.
Each agent receives the same base context plus its own CPS.
Agent E (Battle) runs separately in Phase 3 because it depends on A, B, D outputs.

**Base context for all agents:**
- `architecture.md`
- `agent.md`
- Output files from Phase 1 (shared types and interfaces)

### Agent A
```
Read architecture.md, agent.md, and cps-agent-a-pokemon-list.md in order.
Follow the agent.md pipeline exactly.
Import domain types and repository interface from Phase 1 output.
Do not define DTO or Repository interface — they already exist.
Complete all files listed in the CPS Scope.
```

### Agent B
```
Read architecture.md, agent.md, and cps-agent-b-filter.md in order.
Follow the agent.md pipeline exactly.
Import domain types and repository interface from Phase 1 output.
Do not define DTO or Repository interface — they already exist.
Complete all files listed in the CPS Scope.
```

### Agent C
```
Read architecture.md, agent.md, and cps-agent-c-evolution.md in order.
Follow the agent.md pipeline exactly.
Import EvolutionChain entity and repository interface from Phase 1 output.
Do not redefine existing types.
Complete all files listed in the CPS Scope.
```

### Agent D
```
Read architecture.md, agent.md, and cps-agent-d-favorites.md in order.
Follow the agent.md pipeline exactly.
Use Zustand with localStorage persist middleware for favorites state.
Complete all files listed in the CPS Scope.
```

**Wait for all Phase 2 agents to complete before proceeding.**

---

## Phase 2.5 — Filter + Search Integration

After Phase 2 is complete, integrate Agent A and Agent B outputs yourself (do not spawn a subagent):

- Open `src/presentation/pages/Pokemons.tsx` (created by Agent A)
- Import `TypeFilter` and `GenerationFilter` components from Agent B
- Import `useTypeFilter` and `useGenerationFilter` hooks from Agent B
- Pass active filter state to `usePokemons` hook to gate the displayed list:
  - If a type filter is active, use Agent B's `getPokemonsByType` UseCase result instead of the full list
  - If a generation filter is active, use `getPokemonsByGeneration` UseCase result
  - Text search (`usePokemonSearch`) applies on top of the filtered list
- Render `<TypeFilter />` and `<GenerationFilter />` above the pokemon grid

This integration lives in `Pokemons.tsx` only — do not modify any files created by Agent A or B elsewhere.

After integration, run:
```bash
tsc --noEmit
npm run lint
```
If there are errors, fix them directly before spawning Phase 3. Do not proceed until both pass with 0 errors.

---

## Phase 3 — Battle Simulator

Spawn a subagent with the following context:

**Pass to subagent:**
- `architecture.md`
- `agent.md`
- `cps-agent-e-battle.md`
- Output files from Phase 1 (Pokemon entity, PokemonType entity)
- Output files from Agent D (`useFavorites` hook — for PokemonSelector)

**Instruction:**
```
Read architecture.md, agent.md, and cps-agent-e-battle.md in order.
Follow the agent.md pipeline exactly.
simulateBattle and calculateTypeEffectiveness must be pure functions in Domain layer.
calculateTypeEffectiveness uses a hardcoded static type chart — do not call any API.
Import PokemonType entity from Phase 1 output for type parameter definitions.
Import useFavorites from Agent D output for the PokemonSelector component.
No UI logic in UseCases.
Import existing types and hooks — do not redefine.
Complete all files listed in the CPS Scope.
```

---

## Orchestrator Final Check

After all phases complete:

1. Run `npm run lint` — must pass with 0 errors
2. Run `tsc --noEmit` — must pass with 0 errors
3. Run `npm run dev` — app must start without runtime errors
4. Verify all routes are reachable
5. If any check fails, fix the error directly (do not modify `eslint.config.js` or `architecture.md`)

---

## Hard Rules

- Never modify `eslint.config.js` to suppress errors
- Never use `// eslint-disable`
- Never use `any`
- Never use default export
- Fix code to meet the rules, not the other way around
