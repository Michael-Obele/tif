# Tech Invoice Forge - AI Coding Instructions

You are an expert Svelte 5 developer. This project is an offline-first, client-side-only invoice generator.

## 🏗️ Tech Stack & Architecture

- **Runtime & Tooling**: Bun (`bun`, `bunx`) is the preferred package manager.
- **Framework**: SvelteKit 2 + Svelte 5 (Runes).
- **Server Logic**: Use remote functions in `src/lib/remote/` for all mutations and server logic. NEVER use `+page.server.ts` or `+server.ts` except for `load` functions in `+page.ts`.
- **Database - Local**: **Dexie.js (IndexedDB)** for all local storage. Use singleton clients in `src/lib/db/`.
- **Database - Remote**: **Neon DB (PostgreSQL)** with **Prisma v6** for remote data persistence. Use singleton Prisma client in `src/lib/db/prisma.ts`.
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

- **Location**: All server-side logic (queries, mutations, API calls) resides in `src/lib/remote/[feature].remote.ts`.
- **Neon DB Access**: Import singleton Prisma client from `src/lib/db/prisma.ts` and use exclusively in remote functions.
- **Validation**: Use **Valibot** for all schema definitions and form validation.
- **Pattern**: Use `query` for reads and `form` for mutations via `<form>`. Re-export in `src/lib/remote/index.ts`.
- **CRITICAL**: Remote functions are server-only. Do NOT import them in client components or use them client-side.

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

### Component Organization

- **Blocks Folder**: Shared layout components (Navbar, Footer, mode-toggle, etc.) must be placed in `src/lib/components/blocks/`.
- **Root Components**: Never place component files directly in `src/lib/components/` root. All components should be organized in subdirectories (`blocks/`, `ui/`, `editor/`, `profile/`).
- **Imports**: When referencing blocks components, use paths like `$lib/components/blocks/Navbar.svelte`.

### Build & Validation

- **Type Checking**: Use `bun run check` for validation. This is sufficient for catching errors; avoid running `bun run build` during development unless specifically needed for production testing.

## 🗄️ Neon DB & Prisma v6 Setup

### Overview

- **Database**: PostgreSQL via **Neon DB** (serverless, no cold starts)
- **ORM**: **Prisma v6** (NOT v7) for type-safe database access
- **Location**: Singleton Prisma client at `src/lib/db/prisma.ts`
- **Usage**: Only in remote functions (`src/lib/remote/[feature].remote.ts`)

### Key Rules

✅ **DO:**
- Use Prisma exclusively in `src/lib/remote/` files
- Import the singleton from `src/lib/db/prisma.ts`
- Validate all inputs with Valibot before database operations
- Handle errors gracefully with try/catch blocks
- Export all remote functions from `src/lib/remote/index.ts`

❌ **DON'T:**
- Import Prisma client in Svelte components
- Create multiple `PrismaClient` instances
- Hardcode connection strings
- Use `+page.server.ts` for mutations (use remote functions instead)
- Expose raw database operations to client code

### Setup Commands

```bash
# Generate Prisma client from schema
bun run db:generate

# Push schema changes to Neon
bun run db:push

# Create interactive database UI
bun run db:studio

# Run migrations (if using migration files)
bun run db:migrate

# Seed initial data
bun run db:seed
```

### Example Remote Function

```typescript
// src/lib/remote/waitlist.remote.ts
import { email, minLength, object, parse, string } from 'valibot';
import prisma from '$lib/db/prisma';

const WaitlistSchema = object({
	email: string([minLength(1), email()])
});

export async function subscribeToWaitlist(emailInput: string) {
	try {
		const { email } = parse(WaitlistSchema, { email: emailInput });
		
		const existing = await prisma.waitlist.findUnique({ where: { email } });
		if (existing) {
			return { success: false, message: 'Already subscribed' };
		}

		await prisma.waitlist.create({ data: { email } });
		return { success: true, message: 'Subscribed!' };
	} catch (error) {
		console.error('Subscription error:', error);
		return { success: false, message: 'Failed to subscribe' };
	}
}
```

### Configuration

- **Environment Variables**: See `.env.example` for connection string format
- **Schema**: Define models in `prisma/schema.prisma`
- **Migrations**: Run `bun run db:push` to sync schema with database
- **Documentation**: See `NEON_DB_SETUP.md` for complete setup guide
