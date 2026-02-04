# Tech Invoice Forge - Implementation Todos

[← Back to Index](./index.md) | [Master Plan](./master-plan.md)

---

## Overview

This document tracks all implementation tasks for Tech Invoice Forge. Tasks are organized by phase and component. Mark items as `[x]` when complete, `[/]` when in progress.

---

## Phase 0: Project Setup

### Initial Setup

- [ ] Create SvelteKit project with `bunx sv create tech-invoice-forge`
- [ ] Initialize with TypeScript, Prettier, ESLint
- [ ] Add Tailwind CSS v4 with `bunx sv add tailwindcss`
- [ ] Add shadcn-svelte with `bunx sv add shadcn-svelte`
- [ ] Configure static adapter in `svelte.config.js`
- [ ] Set up path aliases in `svelte.config.js`

### Configure Tailwind

- [ ] Create custom color palette in `tailwind.config.js`
- [ ] Add brand colors (indigo, emerald, amber)
- [ ] Add surface colors (slate-800, slate-900)
- [ ] Configure dark mode as default
- [ ] Add tailwindcss-animate plugin

### Install Core Dependencies

- [x] Configure Native IndexedDB wrapper
- [ ] Install pdfmake for PDF generation
- [ ] Install valibot for validation
- [ ] Install @internationalized/date
- [ ] Install lucide-svelte icons

### Add shadcn Components

- [ ] Add Button component
- [ ] Add Input component
- [ ] Add Textarea component
- [ ] Add Select component
- [ ] Add Popover component
- [ ] Add Calendar component
- [ ] Add Card component
- [ ] Add Dialog component
- [ ] Add Tabs component
- [ ] Add Table component
- [ ] Add Tooltip component
- [ ] Add Badge component
- [ ] Add Separator component
- [ ] Add ScrollArea component
- [ ] Add Sheet component
- [ ] Add Alert component

### Create Base Layout

- [ ] Create root layout with dark theme
- [x] **Configure `ssr: false` in `+layout.ts`** (required for IndexedDB)
- [ ] Add Inter and JetBrains Mono fonts
- [ ] Create Header component
- [ ] Create responsive navigation
- [ ] Add theme toggle (future light mode)

---

## Phase 1: Core MVP

### Database Layer

- [x] Create `$lib/db/db.native.ts` - Native implementation
- [ ] Create `$lib/db/schema.ts` - Table interfaces
- [ ] Create `$lib/db/senders.ts` - Sender CRUD
- [ ] Create `$lib/db/clients.ts` - Client CRUD
- [ ] Create `$lib/db/services.ts` - Service CRUD
- [ ] Create `$lib/db/invoices.ts` - Invoice CRUD
- [ ] Test database operations

### Validation Schemas

- [ ] Create `$lib/schemas/sender.ts`
- [ ] Create `$lib/schemas/client.ts`
- [ ] Create `$lib/schemas/invoice.ts`
- [ ] Create `$lib/schemas/line-item.ts`
- [ ] Create `$lib/schemas/settings.ts`

### Utility Functions

- [ ] Create `$lib/utils/currency.ts` - formatCurrency with Intl
- [ ] Create `$lib/utils/date.ts` - formatDate utilities
- [ ] Create `$lib/utils/invoice-number.ts` - Number generation
- [ ] Create `$lib/utils/calculations.ts` - Totals, tax, discount
- [ ] Create `$lib/constants/currencies.ts` - Currency list
- [ ] Create `$lib/constants/units.ts` - Unit options
- [ ] Create `$lib/constants/payment-terms.ts` - Terms list

### State Management

- [ ] Create `$lib/stores/invoice.svelte.ts` - Invoice state
- [ ] Implement line item management (add, remove, update)
- [ ] Implement computed totals ($derived)
- [ ] Create `$lib/stores/settings.svelte.ts` - App settings
- [ ] Implement settings persistence (localStorage)

### Invoice Form Components

- [ ] Create SectionCard wrapper component
- [ ] Create FormGrid layout component
- [ ] Create SenderForm component
  - [ ] Business name input
  - [ ] Address textarea
  - [ ] Email input
  - [ ] Phone input (optional)
  - [ ] Tax ID input (optional)
  - [ ] Logo upload (optional)
- [ ] Create ClientForm component
  - [ ] Client name input
  - [ ] Company input (optional)
  - [ ] Address textarea
  - [ ] Email input
- [ ] Create InvoiceDetails component
  - [ ] Invoice number input (auto-generated)
  - [ ] Issue date picker
  - [ ] Due date picker
  - [ ] Payment terms select
  - [ ] Currency select
- [ ] Create LineItems component
  - [ ] LineItemRow component
  - [ ] Add item button
  - [ ] Remove item functionality
  - [ ] Reorder functionality (drag/drop)
- [ ] Create Totals component
  - [ ] Subtotal display
  - [ ] Tax total display
  - [ ] Discount input (% or fixed)
  - [ ] Grand total display
- [ ] Create NotesSection component
  - [ ] Notes textarea
  - [ ] Terms textarea
  - [ ] Collapsible behavior

### Remote Functions

- [ ] Create `$lib/remote/index.ts` - Re-export all
- [ ] Create `$lib/remote/client.remote.ts` - Client form handlers
- [ ] Create `$lib/remote/invoice.remote.ts` - Invoice form handlers
- [ ] Create `$lib/remote/service.remote.ts` - Service form handlers
- [ ] Create `$lib/remote/settings.remote.ts` - Settings form handlers

### Main Page

- [ ] Create two-column layout (form + preview)
- [ ] Implement responsive layout (mobile stacked)
- [ ] Wire up all form components
- [ ] Implement form validation with remote functions

---

## Phase 2: PDF Generation

### PDF Setup

- [ ] Create `$lib/pdf/generator.ts` - Main generator
- [ ] Configure pdfmake with dynamic import
- [ ] Set up font loading (VFS fonts)
- [ ] Create `$lib/pdf/styles.ts` - Shared styles

### PDF Templates

- [ ] Create `$lib/pdf/templates/modern.ts`
- [ ] Create `$lib/pdf/templates/classic.ts`
- [ ] Create `$lib/pdf/templates/tech.ts`
- [ ] Create `$lib/pdf/templates/compact.ts`
- [ ] Create template type definitions

### Preview Panel

- [ ] Create PreviewPanel component
- [ ] Implement blob URL generation for preview
- [ ] Add zoom controls (50%, 75%, 100%, 125%, 150%)
- [ ] Add template selector dropdown
- [ ] Implement debounced preview updates (300ms)

### Actions

- [ ] Create DownloadButton component
- [ ] Implement PDF download functionality
- [ ] Add loading state during generation
- [ ] Add success feedback
- [ ] Create PrintButton component
- [ ] Implement print CSS

---

## Phase 3: Data Persistence

### Auto-Save

- [ ] Implement draft auto-save (every 30 seconds)
- [ ] Save on field blur
- [ ] Save on beforeunload
- [ ] Show save indicator
- [ ] Implement draft recovery on page load

### Sender Persistence

- [ ] Auto-load default sender on page load
- [ ] Save sender after first invoice
- [ ] "Remember my details" option

### Client Address Book

- [ ] Create ClientSelector component (dropdown + search)
- [ ] Create AddClientDialog component
- [ ] Create EditClientDialog component
- [ ] Implement save client from form
- [ ] Implement delete client with confirmation
- [ ] Show recently used clients first

### Service Library

- [ ] Create ServiceSelector component
- [ ] Create AddServiceDialog component
- [ ] Create EditServiceDialog component
- [ ] Implement quick-add to line items
- [ ] Category filtering (optional)

### Invoice History

- [ ] Create `/history` route
- [ ] Create InvoiceList component
- [ ] Implement status badges (Draft, Sent, Paid, Overdue)
- [ ] Add search by invoice number/client
- [ ] Add filter by status
- [ ] Add sort by date/amount
- [ ] Add pagination (20 per page)
- [ ] Implement view/edit/duplicate/delete actions

---

## Phase 4: Receipt Mode

### Receipt Generation

- [ ] Create `/receipt` route
- [ ] Modify form for receipt-specific fields
  - [ ] Paid date picker
  - [ ] Payment method select
  - [ ] Transaction reference input
- [ ] Update PDF templates for receipt mode
- [ ] Change title from "INVOICE" to "RECEIPT"
- [ ] Add "PAID" badge

### Convert Invoice to Receipt

- [ ] Add "Convert to Receipt" action in history
- [ ] Pre-fill receipt from invoice data
- [ ] Add payment details form
- [ ] Update invoice status to "Paid" after conversion

---

## Phase 5: Export/Import

### Single Invoice Export

- [ ] Create export invoice as JSON function
- [ ] Include sender and client data
- [ ] Add version and timestamp
- [ ] Trigger file download

### Single Invoice Import

- [ ] Create import dialog
- [ ] Validate JSON structure
- [ ] Show preview before import
- [ ] Option to create new or restore

### Full Backup Export

- [ ] Export all tables (senders, clients, services, invoices)
- [ ] Include settings
- [ ] Add metadata (counts)
- [ ] Trigger file download

### Full Backup Import

- [ ] Create import dialog with file picker
- [ ] Validate backup structure
- [ ] Show summary (X invoices, Y clients)
- [ ] Merge vs Replace options
- [ ] Confirmation before proceeding

---

## Phase 6: Settings & Polish

### Settings Page

- [ ] Create `/settings` route
- [ ] Create settings tabs (Defaults, Appearance, Data)
- [ ] Invoice Defaults section
  - [ ] Default currency select
  - [ ] Default payment terms select
  - [ ] Default tax rate input
  - [ ] Invoice number format configuration
- [ ] Appearance section
  - [ ] Theme toggle (dark/light)
  - [ ] Default template select
- [ ] Data Management section
  - [ ] Export all data button
  - [ ] Import backup button
  - [ ] Clear all data button (with confirmation)

### Support/Pricing Page

- [ ] Create `/support` route (or `/pricing`)
- [ ] "Free Forever" messaging
- [ ] Ko-fi integration button
- [ ] GitHub Sponsors link
- [ ] "Ways to help without paying" section
- [ ] Link in footer navigation

### Logo Upload Feature

- [ ] Create `$lib/utils/logo-compress.ts` - Image compression utility
- [ ] Add logo upload input in SenderForm component
- [ ] Implement drag-and-drop for logo
- [ ] Add logo preview with remove button
- [ ] Save logo as base64 in Dexie.js senders table
- [ ] Integrate logo into all PDF templates

### Keyboard Shortcuts

- [ ] Implement Ctrl/Cmd + S for save draft
- [ ] Implement Ctrl/Cmd + D for download PDF
- [ ] Implement Ctrl/Cmd + N for new invoice
- [ ] Implement Ctrl/Cmd + P for print
- [ ] Add keyboard shortcut hint tooltips

### Accessibility

- [ ] Add proper ARIA labels to all interactive elements
- [ ] Ensure focus management in dialogs
- [ ] Test with keyboard navigation
- [ ] Test with screen reader
- [ ] Verify color contrast ratios

### Empty States

- [ ] Create empty state for invoice history
- [ ] Create empty state for client list
- [ ] Create empty state for service library

### Error Handling

- [ ] Add form validation error messages
- [ ] Add PDF generation error handling
- [ ] Add database error handling
- [ ] Add toast notifications for actions

### Performance

- [ ] Lazy load pdfmake (~500KB)
- [ ] Optimize Tailwind CSS (purge unused)
- [ ] Add loading indicators
- [ ] Test on slow 3G connection

---

## Phase 7: Testing & Deployment

### Browser Testing

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile Chrome (Android)
- [ ] Test on mobile Safari (iOS)

### Responsive Testing

- [ ] Test on 320px width (small phone)
- [ ] Test on 375px width (iPhone)
- [ ] Test on 768px width (tablet)
- [ ] Test on 1024px width (laptop)
- [ ] Test on 1920px width (desktop)

### Functionality Testing

- [ ] Create invoice end-to-end
- [ ] Create receipt end-to-end
- [ ] Test all templates
- [ ] Test all currencies
- [ ] Test export/import
- [ ] Test after browser restart (data persistence)

### Deployment

- [ ] Configure build for production
- [ ] Test production build locally
- [ ] Deploy to Vercel/Netlify/Cloudflare Pages
- [ ] Verify all features work in production
- [ ] Set up custom domain (optional)

---

## Future Enhancements (Post-MVP)

### P1 - High Priority

- [ ] PWA support (offline after first load)
- [ ] Service worker for caching
- [ ] Email invoice (mailto link)
- [ ] Stripe payment links

### P2 - Medium Priority

- [ ] Cloud sync (optional account)
- [ ] Multi-language support (i18n)
- [ ] Recurring invoice templates
- [ ] Invoice analytics/dashboard

### P3 - Low Priority

- [ ] Custom font upload for PDF
- [ ] Invoice scheduling
- [ ] Client portal
- [ ] Team features

---

## Progress Tracking

| Phase                         | Total Tasks | Completed | Progress |
| :---------------------------- | :---------- | :-------- | :------- |
| Phase 0: Setup                | 28          | 0         | 0%       |
| Phase 1: Core MVP             | 45          | 0         | 0%       |
| Phase 2: PDF Generation       | 16          | 0         | 0%       |
| Phase 3: Data Persistence     | 23          | 0         | 0%       |
| Phase 4: Receipt Mode         | 10          | 0         | 0%       |
| Phase 5: Export/Import        | 12          | 0         | 0%       |
| Phase 6: Settings & Polish    | 28          | 0         | 0%       |
| Phase 7: Testing & Deployment | 18          | 0         | 0%       |
| **Total**                     | **180**     | **0**     | **0%**   |

---

## Related Documents

- [Master Plan](./master-plan.md) - Project overview
- [Architecture](./architecture.md) - Technical details
- [Features](./features.md) - Feature specifications
- [Dependencies](./dependencies.md) - Package list
