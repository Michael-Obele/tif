# Tech Invoice Forge - Dependencies

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [Architecture](./architecture.md)

---

## Package Overview

This document lists all NPM packages required to build Tech Invoice Forge. All packages are chosen for their reliability, bundle size efficiency, and compatibility with Svelte 5.

---

## Production Dependencies

### Core Framework

| Package         | Version | Purpose               | Bundle Size |
| :-------------- | :------ | :-------------------- | :---------- |
| `svelte`        | ^5.0.0  | UI framework          | ~15KB       |
| `@sveltejs/kit` | ^2.0.0  | Application framework | ~25KB       |

### UI Components (shadcn-svelte)

| Package             | Version | Purpose                       | Bundle Size    |
| :------------------ | :------ | :---------------------------- | :------------- |
| `bits-ui`           | ^1.0.0  | Headless component primitives | Tree-shakeable |
| `clsx`              | ^2.1.1  | Conditional class names       | ~228B          |
| `tailwind-variants` | ^0.3.0  | Tailwind variant utilities    | ~5KB           |
| `tailwind-merge`    | ^2.5.0  | Merge Tailwind classes        | ~7KB           |

### Icons

| Package         | Version  | Purpose      | Bundle Size    |
| :-------------- | :------- | :----------- | :------------- |
| `lucide-svelte` | ^0.460.0 | Icon library | Tree-shakeable |

### PDF Generation

| Package   | Version | Purpose                    | Bundle Size      |
| :-------- | :------ | :------------------------- | :--------------- |
| `pdfmake` | ^0.2.18 | Client-side PDF generation | ~500KB (chunked) |

### Data Storage

| Package  | Version | Purpose           | Bundle Size |
| :------- | :------ | :---------------- | :---------- |
| `native` | -       | IndexedDB Web API | 0KB         |

> **SSR Note:** IndexedDB is a browser-only API. Logic using the database must be executed within `browser` checks or in Svelte 5 `$effect` runes.

### Forms & Validation

| Package   | Version | Purpose           | Bundle Size |
| :-------- | :------ | :---------------- | :---------- |
| `valibot` | ^1.0.0  | Schema validation | ~10KB       |

> **Note:** We use native HTML forms with SvelteKit's built-in `form()` and `query()` from `$app/server` (remote functions pattern). No external form library needed.

### Authentication (Optional)

| Package       | Version | Purpose                    | Bundle Size |
| :------------ | :------ | :------------------------- | :---------- |
| `better-auth` | ^1.0.0  | Authentication (if needed) | ~15KB       |

> Only install Better Auth if adding cloud sync/user accounts in the future.

### Date Handling

| Package                   | Version | Purpose                          | Bundle Size |
| :------------------------ | :------ | :------------------------------- | :---------- |
| `@internationalized/date` | ^3.7.0  | Date utilities (shadcn calendar) | ~12KB       |

---

## Development Dependencies

### Build Tools

| Package                        | Version | Purpose                |
| :----------------------------- | :------ | :--------------------- |
| `vite`                         | ^6.0.0  | Build tool             |
| `@sveltejs/vite-plugin-svelte` | ^5.0.0  | Svelte Vite plugin     |
| `@sveltejs/adapter-static`     | ^3.0.8  | Static site generation |

### TypeScript

| Package      | Version | Purpose                    |
| :----------- | :------ | :------------------------- |
| `typescript` | ^5.7.0  | Type checking              |
| `tslib`      | ^2.8.0  | TypeScript runtime helpers |

### Styling

| Package               | Version | Purpose              |
| :-------------------- | :------ | :------------------- |
| `tailwindcss`         | ^4.0.0  | Utility-first CSS    |
| `@tailwindcss/vite`   | ^4.0.0  | Tailwind Vite plugin |
| `tailwindcss-animate` | ^1.0.7  | Animation utilities  |

### Code Quality

| Package                       | Version | Purpose                |
| :---------------------------- | :------ | :--------------------- |
| `prettier`                    | ^3.4.0  | Code formatting        |
| `prettier-plugin-svelte`      | ^3.3.0  | Svelte formatting      |
| `prettier-plugin-tailwindcss` | ^0.6.0  | Tailwind class sorting |
| `eslint`                      | ^9.0.0  | Linting                |
| `eslint-plugin-svelte`        | ^2.46.0 | Svelte linting         |
| `@types/node`                 | ^22.0.0 | Node.js types          |

---

## Complete package.json

```json
{
	"name": "tech-invoice-forge",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "eslint .",
		"format": "prettier --write ."
	},
	"dependencies": {
		"@internationalized/date": "^3.10.0",
		"bits-ui": "^?.*",
		"clsx": "^?.*",
		"lucide-svelte": "^?.*",
		"pdfmake": "^?.*",
		"tailwind-merge": "^?.*",
		"tailwind-variants": "^?.*",
		"valibot": "^?.*"
	},
	"devDependencies": {
		"@sveltejs/adapter-static": "^3.0.8",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^5.0.0",
		"@tailwindcss/vite": "^4.0.0",
		"@types/node": "^22.0.0",
		"@types/pdfmake": "^0.2.9",
		"eslint": "^9.0.0",
		"eslint-plugin-svelte": "^2.46.0",
		"prettier": "^3.4.0",
		"prettier-plugin-svelte": "^3.3.0",
		"prettier-plugin-tailwindcss": "^0.6.0",
		"svelte": "^5.0.0",
		"svelte-check": "^4.0.0",
		"tailwindcss": "^4.0.0",
		"tailwindcss-animate": "^1.0.7",
		"tslib": "^2.8.0",
		"typescript": "^5.7.0",
		"vite": "^6.0.0"
	},
	"type": "module"
}
```

---

## Installation Commands

### Create New Project

```bash
# Create SvelteKit project
bunx sv create tech-invoice-forge

# Options to select:
# - SvelteKit minimal
# - TypeScript
# - Prettier
# - ESLint
# - Tailwind CSS (via sv add)
```

### Install Core Dependencies

```bash
cd tech-invoice-forge

# Install base dependencies
bun install

# Add Tailwind CSS v4
bunx sv add tailwindcss

# Add shadcn-svelte
bunx sv add shadcn-svelte

# Install remaining dependencies
bun add dexie pdfmake valibot @internationalized/date

# Install types for pdfmake
bun add -D @types/pdfmake
```

### Add shadcn-svelte Components

```bash
# Initialize shadcn-svelte (done by sv add)
# Then add components as needed:

bunx shadcn-svelte add button
bunx shadcn-svelte add input
bunx shadcn-svelte add textarea
bunx shadcn-svelte add select
bunx shadcn-svelte add popover
bunx shadcn-svelte add calendar
bunx shadcn-svelte add card
bunx shadcn-svelte add dialog
bunx shadcn-svelte add tabs
bunx shadcn-svelte add table
bunx shadcn-svelte add tooltip
bunx shadcn-svelte add badge
bunx shadcn-svelte add separator
bunx shadcn-svelte add scroll-area
bunx shadcn-svelte add sheet
bunx shadcn-svelte add alert
```

---

## Package Details

### pdfmake

**Why pdfmake?**

- Pure JavaScript, runs entirely in browser
- No server dependency
- Excellent table support (critical for invoices)
- Custom fonts support
- Declarative document definition

**Import Strategy:**

```typescript
// Dynamic import to reduce initial bundle
const pdfMake = await import('pdfmake/build/pdfmake');
const pdfFonts = await import('pdfmake/build/vfs_fonts');
pdfMake.default.vfs = pdfFonts.default.pdfMake.vfs;
```

**Vite Configuration for Code Splitting:**

```typescript
// vite.config.ts
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					pdfmake: ['pdfmake']
				}
			}
		}
	}
});
```

---

### Dexie.js

**Why Dexie?**

- Best-in-class IndexedDB wrapper
- Promise-based API
- Excellent TypeScript support
- Query syntax similar to SQL
- Active maintenance

**Basic Usage:**

```typescript
import Dexie, { type Table } from 'dexie';

interface Client {
	id?: number;
	name: string;
	email: string;
}

class MyDB extends Dexie {
	clients!: Table<Client>;

	constructor() {
		super('MyDatabase');
		this.version(1).stores({
			clients: '++id, name, email'
		});
	}
}

export const db = new MyDB();

// Usage
await db.clients.add({ name: 'John', email: 'john@example.com' });
const clients = await db.clients.where('name').startsWith('J').toArray();
```

---

### Remote Functions Pattern (form() + Valibot)

**Why this pattern?**

- Native SvelteKit integration via `$app/server`
- No external form library dependencies
- Valibot: Smaller than Zod (~10KB vs ~50KB)
- Excellent TypeScript inference
- Server-side validation with client-side UX

**Remote Function Definition:**

```typescript
// $lib/remote/invoice.remote.ts
import { form, query, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { db } from '$lib/db';

// Define validation schema
const createClientSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty('Name is required'), v.maxLength(100)),
	company: v.optional(v.string()),
	address: v.pipe(v.string(), v.nonEmpty('Address is required')),
	email: v.pipe(v.string(), v.email('Invalid email format'))
});

// Create a remote form function
export const createClient = form(createClientSchema, async (data, issue) => {
	try {
		// Save to IndexedDB (or server DB if authenticated)
		const id = await db.clients.add({
			...data,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, id };
	} catch (error: any) {
		// Use issue() for validation errors
		issue(error.message || 'Failed to create client');
	}
});

// Query function for reading data
export const getClients = query(async () => {
	return await db.clients.orderBy('name').toArray();
});
```

**Using Remote Functions in Components:**

```html
<script lang="ts">
  import { createClient } from '$lib/remote/invoice.remote';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  let isSubmitting = $state(false);
</script>

<form
  {...createClient.enhance(async ({ form, submit }) => {
    isSubmitting = true;
    await submit();
    isSubmitting = false;

    if (createClient.result?.success) {
      goto('/clients');
    }
  })}
>
  <!-- Display form-level errors -->
  {#each createClient.fields.allIssues() as issue}
    <p class="text-sm text-destructive">{issue.message}</p>
  {/each}

  <!-- Form fields with automatic binding -->
  <div class="grid gap-2">
    <label for="name">Name</label>
    <Input id="name" {...createClient.fields.name.as('text')} />
    {#each createClient.fields.name.issues() as issue}
      <p class="text-sm text-destructive">{issue.message}</p>
    {/each}
  </div>

  <div class="grid gap-2">
    <label for="email">Email</label>
    <Input id="email" type="email" {...createClient.fields.email.as('email')} />
    {#each createClient.fields.email.issues() as issue}
      <p class="text-sm text-destructive">{issue.message}</p>
    {/each}
  </div>

  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Saving...' : 'Save Client'}
  </Button>
</form>
```

**Key Benefits:**

- No `+page.server.ts` or `+server.ts` files needed for form handling
- Forms work via progressive enhancement
- Type-safe field bindings
- Built-in validation with error display
- Works with Better Auth for authenticated requests

---

### @internationalized/date

**Why?**

- Required by shadcn-svelte Calendar component
- Handles date manipulation without timezone issues
- Works with different calendar systems
- Immutable date objects

**Usage with Calendar:**

```html
<script>
	import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';

	let value = $state(today(getLocalTimeZone()));
</script>

<Calendar bind:value />
```

---

## Bundle Size Optimization

### Total Estimated Size

| Category            | Size (gzip)    |
| :------------------ | :------------- |
| Svelte + SvelteKit  | ~40KB          |
| shadcn components   | ~20KB (used)   |
| Tailwind CSS        | ~10KB (purged) |
| pdfmake (chunk)     | ~150KB         |
| Dexie               | ~10KB          |
| Forms + Validation  | ~15KB          |
| Date handling       | ~5KB           |
| **Initial Load**    | **~100KB**     |
| **With PDF (lazy)** | **~250KB**     |

### Optimization Strategies

1. **Lazy load pdfmake** - Only load when generating PDF
2. **Tree-shake icons** - Import only used Lucide icons
3. **Purge Tailwind** - Remove unused CSS
4. **Code split by route** - SvelteKit handles this automatically

---

## Version Compatibility

| Package       | Svelte 5 | Notes                    |
| :------------ | :------- | :----------------------- |
| bits-ui       | ✅       | Native Svelte 5 support  |
| lucide-svelte | ✅       | Works with Svelte 5      |
| pdfmake       | ✅       | Framework agnostic       |
| dexie         | ✅       | Framework agnostic       |
| valibot       | ✅       | Framework agnostic       |
| better-auth   | ✅       | Native SvelteKit support |

---

## Alternative Packages Considered

### PDF Generation

| Package   | Rejected Because                       |
| :-------- | :------------------------------------- |
| jsPDF     | Less declarative, harder table support |
| pdf-lib   | Best for editing, not creation         |
| react-pdf | React-specific                         |
| Puppeteer | Server-side only                       |

### Validation

| Package | Rejected Because               |
| :------ | :----------------------------- |
| Zod     | Larger bundle (~50KB vs ~10KB) |
| Yup     | Older, less TypeScript support |

### Storage

| Package     | Rejected Because             |
| :---------- | :--------------------------- |
| idb         | Lower-level API              |
| localForage | Additional abstraction layer |

---

## Related Documents

- [Architecture](./architecture.md) - Technical setup
- [Master Plan](./master-plan.md) - Project overview
