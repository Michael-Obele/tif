# Tech Invoice Forge - Architecture

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [Features](./features.md)

---

## System Overview

Tech Invoice Forge is a SvelteKit application focused on client-side invoice creation and PDF generation. The main application logic runs in the browser, while optional server-side capabilities are isolated behind remote functions.

```text
Browser UI (SvelteKit + Svelte 5)
  -> Rune-based stores in src/lib/stores/
  -> Local persistence through db singleton in src/lib/db/db.ts
  -> PDF generation through src/lib/pdf/

Optional server-side features
  -> Remote functions in src/lib/remote/
  -> Prisma + Neon client in src/lib/db/prisma.ts
```

---

## Technology Stack

### Core Framework

| Package                  | Version   | Purpose                 |
| ------------------------ | --------- | ----------------------- |
| `svelte`                 | `^5.48.2` | UI framework with runes |
| `@sveltejs/kit`          | `^2.50.1` | Application framework   |
| `@sveltejs/adapter-auto` | `^7.0.0`  | Deployment adapter      |

### UI and Styling

| Package             | Version    | Purpose                                              |
| ------------------- | ---------- | ---------------------------------------------------- |
| `bits-ui`           | `^2.14.4`  | Headless primitives used by shadcn-svelte components |
| `@lucide/svelte`    | `^0.561.0` | Icons                                                |
| `clsx`              | `^2.1.1`   | Class composition                                    |
| `tailwind-merge`    | `^3.4.0`   | Tailwind class merging                               |
| `tailwind-variants` | `^3.2.2`   | Variant helpers                                      |
| `tailwindcss`       | `^4.1.18`  | Styling system                                       |
| `@tailwindcss/vite` | `^4.1.18`  | Tailwind Vite integration                            |
| `tw-animate-css`    | `^1.4.0`   | Animation utilities imported in layout CSS           |

### Local Data and Reactivity

| Package      | Version  | Purpose                                  |
| ------------ | -------- | ---------------------------------------- |
| `svelte-idb` | `^0.1.5` | IndexedDB engine with live-query support |

### PDF and Validation

| Package                   | Version   | Purpose                    |
| ------------------------- | --------- | -------------------------- |
| `pdfmake`                 | `^0.3.3`  | Client-side PDF generation |
| `valibot`                 | `^1.2.0`  | Validation schemas         |
| `@internationalized/date` | `^3.10.0` | Calendar/date utilities    |

### Optional Remote/Server Features

| Package          | Version  | Purpose                              |
| ---------------- | -------- | ------------------------------------ |
| `@prisma/client` | `^6.0.0` | Database client for remote functions |
| `prisma`         | `^6.0.0` | Schema and code generation           |

`better-auth` is still a planned integration for future cloud sync work, but it is not currently installed in the repository.

---

## Project Structure

```text
src/
  lib/
    components/
      blocks/
      editor/
      profile/
      ui/
    db/
      db.svelte.ts
      db.native.ts
      db.ts
      prisma.ts
      README.md
    pdf/
      markdown.ts
      templates/
      types.ts
      utils.ts
    remote/
      index.ts
      waitlist.remote.ts
    stores/
      invoice.svelte.ts
      profile.svelte.ts
    utils/
      pdf-generator.ts
      profile-transfer.ts
  routes/
    +layout.svelte
    +page.svelte
    layout.css
    invoice/new/+page.svelte
    invoices/+page.svelte
    pricing/+page.svelte
    profile/+page.svelte
```

This document intentionally reflects the current repository layout rather than earlier planned folders that are not present.

---

## State Management

State lives primarily in class-based rune stores:

| File                               | Responsibility                                          |
| ---------------------------------- | ------------------------------------------------------- |
| `src/lib/stores/invoice.svelte.ts` | Current invoice draft, autosave, history access, totals |
| `src/lib/stores/profile.svelte.ts` | Sender profile, clients, profile import/export          |

Current patterns in the repo:

- `$state` for mutable local store state
- `$derived` for totals and computed snapshots
- direct method calls for actions such as save, delete, import, and reset
- selective live-query adoption for IndexedDB-backed data such as invoice history

---

## Remote Functions Layer

Remote/server logic lives in `src/lib/remote/`.

Current files:

| File                                | Responsibility                            |
| ----------------------------------- | ----------------------------------------- |
| `src/lib/remote/waitlist.remote.ts` | Waitlist subscription reads and mutations |
| `src/lib/remote/index.ts`           | Re-export surface                         |

This project standardizes on remote functions rather than `+page.server.ts` mutation handlers.

---

## Database Layer

### Public Entry Point

Use the singleton from `src/lib/db/db.ts`:

```typescript
import { db } from '$lib/db/db';
```

### Implementation Layout

| File                      | Role                                                                |
| ------------------------- | ------------------------------------------------------------------- |
| `src/lib/db/db.svelte.ts` | Defines the `createReactiveDB()` instance and compatibility adapter |
| `src/lib/db/db.native.ts` | Compatibility re-export for existing imports                        |
| `src/lib/db/db.ts`        | Stable import surface for the app                                   |

### Why a Compatibility Adapter Exists

The app previously used a handwritten native IndexedDB wrapper. The current implementation keeps the same CRUD API but swaps the engine to `svelte-idb`, which allows incremental use of live queries without forcing every caller to change at once.

Supported store methods remain:

- `add`
- `put`
- `get`
- `getAll`
- `getAllFromIndex`
- `delete`
- `clear`
- `count`

Additional reactive methods now available through the adapter:

- `liveAll`
- `liveGet`
- `liveCount`
- `db.liveQuery(...)`

### Schema

| Store          | Key Path | Auto Increment | Indexes                                                  |
| -------------- | -------- | -------------- | -------------------------------------------------------- |
| `senders`      | `id`     | ✓              | `isDefault`                                              |
| `clients`      | `id`     | ✓              | `email`                                                  |
| `serviceItems` | `id`     | ✓              | -                                                        |
| `invoices`     | `id`     | ✓              | `isDraft`, `status`, `createdAt`, `[isDraft, createdAt]` |
| `settings`     | `id`     | ✗              | -                                                        |

Database identity remains:

- Name: `TechInvoiceForgeDB`
- Version: `3`

The v3 upgrade hook still clears `invoices` when upgrading from versions below 3 to remove corrupted legacy data.

---

## PDF Generation

PDF generation remains fully client-side and lives in `src/lib/pdf/`.

| Area            | Files                                                     |
| --------------- | --------------------------------------------------------- |
| Shared helpers  | `markdown.ts`, `types.ts`, `utils.ts`                     |
| Templates       | `templates/bold.ts`, `classic.ts`, `modern.ts`, `tech.ts` |
| App integration | `src/lib/utils/pdf-generator.ts`                          |

---

## Build Configuration

### SvelteKit

Current `svelte.config.js` uses:

- `@sveltejs/adapter-auto`
- `kit.experimental.remoteFunctions = true`
- `compilerOptions.experimental.async = true`

### Vite

Current `vite.config.ts` uses:

- `@tailwindcss/vite`
- `@sveltejs/kit/vite`
- `vite-plugin-devtools-json`

### Styling

Global styling is defined in `src/routes/layout.css`.

Important current details:

- Tailwind CSS v4 via `@import 'tailwindcss'`
- animation utilities via `@import 'tw-animate-css'`
- theme tokens and utility classes are declared directly in CSS
- there is no `tailwind.config.js` in the current repo

---

## Deployment

The project uses `adapter-auto`, so the exact deployment target depends on the host environment. For local validation, the relevant commands are:

```bash
bun run dev
bun run check
bun run build
```

---

## Related Documents

- [Master Plan](./master-plan.md)
- [Features](./features.md)
- [Data Models](./data-models.md)
- [Dependencies](./dependencies.md)
- [UI/UX Design](./ui-ux.md)
