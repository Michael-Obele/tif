# Native IndexedDB Implementation

This document explains the native IndexedDB implementation used in Tech Invoice Forge.

## Overview

Instead of using wrapper libraries like `idb` or `Dexie.js`, this project uses a clean, custom wrapper around the browser's native IndexedDB API. This provides:

- **Zero dependencies** - No external libraries to manage
- **Full control** - Customize exactly what we need
- **Easy debugging** - Direct IndexedDB calls are easier to trace
- **Small footprint** - ~170 lines of typed TypeScript

## Architecture

### Files

| File           | Purpose                                    |
| -------------- | ------------------------------------------ |
| `db.native.ts` | Native IndexedDB wrapper implementation    |
| `db.ts`        | Re-exports `db` from native implementation |
| `db.dexie.ts`  | Dexie implementation (kept for reference)  |

### Classes

#### `NativeStore<T>`

A generic class that wraps IndexedDB object store operations:

```typescript
class NativeStore<T> {
  async add(value: T): Promise<IDBValidKey>
  async put(value: T): Promise<IDBValidKey>
  async get(key: number | string): Promise<T | undefined>
  async getAll(): Promise<T[]>
  async getAllFromIndex(indexName: string, query?: IDBValidKey): Promise<T[]>
  async delete(key: number | string): Promise<void>
  async clear(): Promise<void>
  async count(): Promise<number>
}
```

#### `TechInvoiceForgeNativeDB`

The main database class with typed store accessors:

```typescript
class TechInvoiceForgeNativeDB {
  senders: NativeStore<Sender>
  clients: NativeStore<Client>
  serviceItems: NativeStore<ServiceItem>
  invoices: NativeStore<Invoice>
  settings: NativeStore<AppSettings>
}
```

## Usage

### Import

```typescript
import { db } from '$lib/db/db';
```

### Basic Operations

```typescript
// Add a new record
const id = await db.invoices.add(invoice);

// Update a record (upsert)
await db.invoices.put(invoice);

// Get a single record
const invoice = await db.invoices.get(123);

// Get all records
const allInvoices = await db.invoices.getAll();

// Query by index
const drafts = await db.invoices.getAllFromIndex('isDraft', 1);

// Delete a record
await db.invoices.delete(123);

// Clear all records
await db.invoices.clear();

// Count records
const count = await db.invoices.count();
```

## Schema

| Store          | Key Path | Auto Increment | Indexes                                                  |
| -------------- | -------- | -------------- | -------------------------------------------------------- |
| `senders`      | `id`     | ✓              | `isDefault`                                              |
| `clients`      | `id`     | ✓              | `email`                                                  |
| `serviceItems` | `id`     | ✓              | -                                                        |
| `invoices`     | `id`     | ✓              | `isDraft`, `status`, `createdAt`, `[isDraft, createdAt]` |
| `settings`     | `id`     | ✗              | -                                                        |

## SSR Safety

The implementation is SSR-safe. On the server, `dbPromise` is set to a never-resolving Promise, preventing any IndexedDB operations from executing:

```typescript
if (!browser) {
  this.dbPromise = new Promise(() => {}); // Never resolves on server
} else {
  this.dbPromise = this.openDatabase();
}
```

## Version Migrations

The database uses version 3. When upgrading from older versions:

- **v2 → v3**: Clears the `invoices` table to remove corrupted data from a previous serialization issue

## Debugging

All database operations log to the console with the `[NativeDB]` prefix:

```
[NativeDB] Database opened successfully
[NativeDB] Created store: invoices
[NativeDB] Created index: invoices.isDraft
```

## Comparison with Alternatives

| Feature        | Native (this) | idb    | Dexie  |
| -------------- | ------------- | ------ | ------ |
| Bundle size    | ~3KB          | ~8KB   | ~25KB  |
| Complexity     | Low           | Medium | High   |
| Type safety    | ✓             | ✓      | ✓      |
| SSR safe       | ✓             | ✓      | Custom |
| Debugging      | Easy          | Medium | Hard   |
| Learning curve | Low           | Low    | Medium |

## Future Improvements

- Add transaction support for atomic operations
- Implement cursor-based iteration for large datasets
- Add optional encryption for sensitive data
