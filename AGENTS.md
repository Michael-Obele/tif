# Tech Invoice Forge - AI Coding Instructions

You are an expert Svelte 5 developer. This project is an offline-first, client-side-only invoice generator.

## 🏗️ Tech Stack & Architecture

- **Runtime & Tooling**: Bun (`bun`, `bunx`) is the preferred package manager.
- **Framework**: SvelteKit 2 + Svelte 5 (Runes).
- NEVER use `+page.server.ts` or `+server.ts` except for load functions.
- **Database**: **Dexie.js (IndexedDB)** for all local storage. Use singleton clients in `src/lib/db/`.
- **PDF**: Client-side generation using **pdfmake** in `src/lib/pdf/`.
- **Styling**: Tailwind CSS v4. NEVER use gradients; use "Slate Professional" theme (Slate/Indigo).
- **Icons**: Use `@lucide/svelte`. Import as components: `import { IconName } from '@lucide/svelte'`.
- **Authentication**: Better Auth (optional) for future cloud sync features.

## 🎨 Coding Conventions

### Quality Gate

- **Proactive Checking**: Run `bun run check` after substantive edits to catch type errors.
- **Svelte 5 Runes**: Always use `$state`, `$props`, `$derived`, and `$effect`. Never use legacy `export let` or `$:`.
- **Events**: Use modern event attributes (e.g., `onclick`, `onsubmit`) directly on elements.

### Deprecated Svelte Patterns to Avoid

- **State**: Never use `let` at the top level for reactivity. Use `$state()`.
- **Props**: Never use `export let`. Use `$props()` destructuring.
- **Events**: Avoid `on:click` directives; use `onclick` attributes. Never use `createEventDispatcher`.
- **Lifecycle**: Avoid `onMount` for state; use `$effect`. Avoid `beforeUpdate`/`afterUpdate`.
- **Slots**: Avoid `<slot />`. Use `{@render children()}` with snippets.
- **Store**: Use `import { page } from '$app/state'` instead of `$app/stores`.

### Data Fetching & Mutations (Remote Functions)

- **Location**: Mutation logic resides in `src/lib/remote/[feature].remote.ts`.
- **Validation**: Use **Valibot** for all schema definitions and form validation.
- **Pattern**: Use `query` for reads and `form` for mutations via `<form>`. Re-export in `src/lib/remote/index.ts`.

## 🛠️ Common Workflows

- **Development**: `bun dev`
- **Build**: `bun build`
- **UI Components**: `bun x shadcn-svelte@latest add [component]`

## 📂 Key Directories

- `src/lib/remote/`: Data fetching and mutation logic.
- `src/lib/db/`: Dexie database schema and CRUD.
- `src/lib/pdf/`: PDF templates and generator logic.
- `src/lib/stores/`: Logic using Svelte 5 runes.
- `src/lib/components/ui/`: shadcn-svelte primitives.

## 🤖 AI Agent Integration

- **Context**: Use `mcp_svelte_get-documentation` for latest Svelte 5 logic.
- **Validation**: Use `mcp_svelte_svelte-autofixer` to validate components before finishing.

