# Tech Invoice Forge - Dependencies

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [Architecture](./architecture.md)

---

## Package Overview

This document summarizes the packages currently used in the repository. The source of truth is the root `package.json`.

---

## Runtime Dependencies

### Core App

| Package                   | Version   | Purpose                    |
| ------------------------- | --------- | -------------------------- |
| `svelte`                  | `^5.48.2` | UI framework               |
| `@sveltejs/kit`           | `^2.50.1` | App framework              |
| `pdfmake`                 | `^0.3.3`  | Client-side PDF generation |
| `valibot`                 | `^1.2.0`  | Validation                 |
| `@internationalized/date` | `^3.10.0` | Calendar/date helpers      |

### UI and Styling

| Package             | Version    | Purpose                |
| ------------------- | ---------- | ---------------------- |
| `bits-ui`           | `^2.14.4`  | Headless primitives    |
| `@lucide/svelte`    | `^0.561.0` | Icons                  |
| `clsx`              | `^2.1.1`   | Class composition      |
| `tailwind-merge`    | `^3.4.0`   | Tailwind merge utility |
| `tailwind-variants` | `^3.2.2`   | Variant helpers        |
| `tailwindcss`       | `^4.1.18`  | Styling system         |
| `@tailwindcss/vite` | `^4.1.18`  | Tailwind Vite plugin   |
| `tw-animate-css`    | `^1.4.0`   | Animation utilities    |

### Local Persistence

| Package      | Version  | Purpose                                  |
| ------------ | -------- | ---------------------------------------- |
| `svelte-idb` | `^0.1.5` | IndexedDB engine with live-query support |

Tech Invoice Forge does not expose raw `svelte-idb` stores directly to the rest of the app. Instead, it keeps a stable singleton API in `src/lib/db/db.ts` and backs that API with a compatibility adapter in `src/lib/db/db.svelte.ts`.

### Other Runtime Utilities

| Package               | Version    | Purpose                |
| --------------------- | ---------- | ---------------------- |
| `currency-codes-ts`   | `^3.0.0`   | Currency metadata      |
| `currency-symbol-map` | `^5.1.0`   | Currency symbol lookup |
| `mode-watcher`        | `^1.1.0`   | Theme/mode support     |
| `motion`              | `^12.34.3` | Animation utilities    |
| `runed`               | `^0.37.1`  | Rune-oriented helpers  |
| `svelte-sonner`       | `^1.0.7`   | Toast notifications    |

---

## Development Dependencies

| Package                        | Version  | Purpose                    |
| ------------------------------ | -------- | -------------------------- |
| `@sveltejs/adapter-auto`       | `^7.0.0` | Default deployment adapter |
| `@sveltejs/vite-plugin-svelte` | `^6.2.4` | Svelte Vite integration    |
| `vite`                         | `^7.3.1` | Build tool                 |
| `vite-plugin-devtools-json`    | `^1.0.0` | Devtools JSON integration  |
| `typescript`                   | `^5.9.3` | Type checking              |
| `svelte-check`                 | `^4.3.5` | Svelte diagnostics         |
| `prettier`                     | `^3.8.1` | Formatting                 |
| `prettier-plugin-svelte`       | `^3.4.1` | Svelte formatting          |
| `prettier-plugin-tailwindcss`  | `^0.7.2` | Tailwind class sorting     |
| `@types/pdfmake`               | `^0.3.0` | PDF type support           |
| `@prisma/client`               | `^6.0.0` | Prisma runtime client      |
| `prisma`                       | `^6.0.0` | Prisma tooling             |

---

## Not Currently Installed

These technologies are referenced elsewhere in product planning, but they are not currently present in `package.json`:

- `better-auth`
- `eslint`
- `@types/node`
- `tslib`
- `@sveltejs/adapter-static`

If any of these are introduced later, this document should be updated alongside `package.json`.

---

## Current Commands

The repository currently defines these primary commands:

```bash
bun run dev
bun run build
bun run preview
bun run check
bun run format
bun run db:generate
bun run db:push
bun run db:migrate
bun run db:studio
```

---

## Installation

For a fresh checkout of the current repository:

```bash
bun install
bun run check
```

If reproducing the current local database stack in another Svelte 5 project, the key additions are:

```bash
bun add svelte-idb pdfmake valibot @internationalized/date
```

---

## Package Notes

### `svelte-idb`

Why it is used here:

- preserves a small IndexedDB abstraction surface
- provides live-query support for Svelte 5 runes
- handles SSR safely with noop behavior
- allows a low-risk migration because the app keeps its existing `db` singleton API

### `pdfmake`

Why it is used here:

- fully client-side PDF generation
- declarative document definitions
- suitable for invoice table layouts

### `valibot`

Why it is used here:

- compact runtime footprint
- strong schema typing
- good fit for remote-function input validation

---

## Source of Truth

Use the root `package.json` for exact versions. This document is a maintained summary, not the canonical manifest.

---

## Related Documents

- [Architecture](./architecture.md)
- [Master Plan](./master-plan.md)
- [Data Models](./data-models.md)
- [Index](./index.md)
