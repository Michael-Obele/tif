# Local Database Layer

This document explains the current IndexedDB layer used in Tech Invoice Forge.

## Overview

The app now uses `svelte-idb` as the IndexedDB engine, wrapped in a compatibility adapter so the rest of the codebase can keep using the existing `db.<store>.add/put/get/getAll/getAllFromIndex/delete/clear/count` API.

This keeps the migration low-risk while enabling Svelte 5 live queries.

## Files

| File | Purpose |
| --- | --- |
| `db.svelte.ts` | Defines the reactive database with `createReactiveDB()` and wraps stores in a compatibility adapter |
| `db.native.ts` | Compatibility re-export kept to avoid breaking existing imports |
| `db.ts` | Stable public entry point for the local database singleton |
| `prisma.ts` | Separate remote Prisma client for Neon/PostgreSQL work |

## Public API

Import the singleton from the stable entry point:

```typescript
import { db } from '$lib/db/db';
```

Supported CRUD methods remain unchanged:

```typescript
const id = await db.invoices.add(invoice);
await db.invoices.put(invoice);
const invoice = await db.invoices.get(123);
const invoices = await db.invoices.getAll();
const drafts = await db.invoices.getAllFromIndex('isDraft', 1);
await db.invoices.delete(123);
await db.invoices.clear();
const count = await db.invoices.count();
```

Reactive helpers are also available for incremental adoption:

```typescript
const allInvoices = db.invoices.liveAll();
const singleInvoice = db.invoices.liveGet(123);
const invoiceCount = db.invoices.liveCount();
```

## Schema

| Store | Key Path | Auto Increment | Indexes |
| --- | --- | --- | --- |
| `senders` | `id` | ✓ | `isDefault` |
| `clients` | `id` | ✓ | `email` |
| `serviceItems` | `id` | ✓ | - |
| `invoices` | `id` | ✓ | `isDraft`, `status`, `createdAt`, `[isDraft, createdAt]` |
| `settings` | `id` | ✗ | - |

The database identity stays the same:

- Name: `TechInvoiceForgeDB`
- Version: `3`

## SSR Behavior

`db.svelte.ts` uses `svelte-idb` with `ssr: 'noop'`, so server-side rendering returns safe defaults instead of crashing on IndexedDB access.

## Migration Hook

The current upgrade hook preserves the previous v3 cleanup behavior:

- `v2 -> v3`: clear the `invoices` store to remove corrupted legacy records

## Notes

- The adapter still strips `id: undefined` before `add()` and `put()` so auto-increment behavior stays consistent.
- Existing code can continue importing from `$lib/db/db` without knowing the backing implementation changed.
- New code can adopt `liveAll()`, `liveGet()`, `liveCount()`, or `db.liveQuery()` selectively.
