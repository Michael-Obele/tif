# Tech Invoice Forge - Features

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [Architecture](./architecture.md)

---

## Feature Overview

This document provides detailed specifications for all features in Tech Invoice Forge. Features are organized by priority and implementation phase.

---

## Phase 1: Core MVP

### 1.1 Invoice Form

#### Sender Information Section

**Fields:**
| Field         | Type     | Required | Validation             | Notes                            |
| :------------ | :------- | :------- | :--------------------- | :------------------------------- |
| Business Name | Text     | Yes      | 1-100 chars            | Displayed prominently on invoice |
| Address       | Textarea | Yes      | 5-500 chars            | Multi-line, preserves formatting |
| Email         | Email    | Yes      | Valid email format     | Contact email on invoice         |
| Phone         | Tel      | No       | E.164 format preferred | Optional contact                 |
| Tax ID / VAT  | Text     | No       | 1-50 chars             | For tax compliance               |
| Logo          | File     | No       | PNG, JPG, SVG; max 2MB | Displayed on invoice header      |

**Behavior:**
- Auto-saves to IndexedDB when field loses focus
- Loads automatically on return visits
- "Clear" button resets all fields
- Logo preview with remove option

---

#### Client Information Section

**Fields:**
| Field       | Type     | Required | Validation         | Notes                         |
| :---------- | :------- | :------- | :----------------- | :---------------------------- |
| Client Name | Text     | Yes      | 1-100 chars        | Individual or business name   |
| Company     | Text     | No       | 1-100 chars        | If different from client name |
| Address     | Textarea | Yes      | 5-500 chars        | Billing address               |
| Email       | Email    | Yes      | Valid email format | For records                   |

**Features:**
- **Client Selector**: Dropdown to select from saved clients
- **Quick Add**: Save current client to address book
- **Edit Client**: Modify existing saved client

---

#### Invoice Details Section

**Fields:**
| Field          | Type   | Required | Default         | Notes                                                   |
| :------------- | :----- | :------- | :-------------- | :------------------------------------------------------ |
| Invoice Number | Text   | Yes      | Auto-generated  | Format: `INV-2026-0001`                                 |
| Issue Date     | Date   | Yes      | Today           | Date picker with calendar                               |
| Due Date       | Date   | No       | Issue + 30 days | Calculated from payment terms                           |
| Payment Terms  | Select | Yes      | Net 30          | Presets: Due on Receipt, Net 15, Net 30, Net 45, Net 60 |
| Currency       | Select | Yes      | USD             | 30+ currencies supported                                |

**Payment Terms Options:**
```typescript
const PAYMENT_TERMS = [
  { value: 'due_on_receipt', label: 'Due on Receipt', days: 0 },
  { value: 'net_7', label: 'Net 7', days: 7 },
  { value: 'net_15', label: 'Net 15', days: 15 },
  { value: 'net_30', label: 'Net 30', days: 30 },
  { value: 'net_45', label: 'Net 45', days: 45 },
  { value: 'net_60', label: 'Net 60', days: 60 },
  { value: 'custom', label: 'Custom', days: null }
];
```

---

#### Line Items Section

**Per-Item Fields:**
| Field       | Type     | Width | Validation      | Notes                       |
| :---------- | :------- | :---- | :-------------- | :-------------------------- |
| Description | Text     | 40%   | 1-500 chars     | Service/product description |
| Quantity    | Number   | 10%   | > 0, 2 decimals | Amount of units             |
| Unit        | Select   | 10%   | Required        | hour, day, unit, flat       |
| Rate        | Currency | 15%   | >= 0            | Price per unit              |
| Tax         | Number   | 10%   | 0-100%          | Tax rate %                  |
| Amount      | Display  | 15%   | Calculated      | Qty × Rate                  |

**Unit Options:**
```typescript
const UNITS = [
  { value: 'hour', label: 'Hour', plural: 'Hours' },
  { value: 'day', label: 'Day', plural: 'Days' },
  { value: 'unit', label: 'Unit', plural: 'Units' },
  { value: 'flat', label: 'Flat', plural: 'Flat' },
  { value: 'project', label: 'Project', plural: 'Projects' },
  { value: 'month', label: 'Month', plural: 'Months' },
  { value: 'word', label: 'Word', plural: 'Words' },
  { value: 'page', label: 'Page', plural: 'Pages' }
];
```

**Features:**
- **Add Row**: Button to add new line item
- **Remove Row**: X button per row (confirm if filled)
- **Reorder Rows**: Drag handle for manual ordering
- **Service Selector**: Quick-add from saved services
- **Keyboard Navigation**: Tab through fields, Enter to add row

---

#### Totals Section

**Calculated Fields:**
| Field         | Calculation                   | Notes                    |
| :------------ | :---------------------------- | :----------------------- |
| Subtotal      | Σ (Qty × Rate)                | Before tax and discount  |
| Tax           | Σ (Qty × Rate × Tax%)         | Per-item tax calculation |
| Discount      | Subtotal × Discount% OR fixed | User-editable            |
| **Total Due** | Subtotal + Tax - Discount     | Bold, prominent          |

**Discount Options:**
- Percentage (e.g., 10%)
- Fixed amount (e.g., $50)
- Toggle between modes

---

#### Notes & Terms Section

**Fields:**
| Field              | Type     | Max Length | Notes                           |
| :----------------- | :------- | :--------- | :------------------------------ |
| Notes              | Textarea | 2000 chars | Payment instructions, thank you |
| Terms & Conditions | Textarea | 5000 chars | Legal terms, late fees          |

**Features:**
- Collapsible sections to reduce clutter
- Common templates (e.g., "Payment due within X days")
- Saved defaults from settings

---

### 1.2 Live PDF Preview

**Implementation:**
- Generate pdfmake document definition in real-time
- Render to blob URL for iframe/embed preview
- Debounced updates (300ms after last input)

**Preview Panel Features:**
| Feature         | Description                         |
| :-------------- | :---------------------------------- |
| Zoom Controls   | 50%, 75%, 100%, 125%, 150%          |
| Scroll          | Vertical scroll for multi-page      |
| Template Switch | Change template without losing data |
| Refresh         | Manual refresh button               |

---

### 1.3 PDF Download

**Behavior:**
- Generate final PDF using pdfmake
- Trigger browser download
- Filename: `{invoice-number}.pdf` (e.g., `INV-2026-0001.pdf`)

**Button States:**
- Default: "Download PDF"
- Loading: "Generating..."
- Success: Brief checkmark feedback

---

### 1.4 Invoice Number Generation

**Default Format:** `{PREFIX}-{YEAR}-{SEQUENCE}`

**Examples:**
- `INV-2026-0001`
- `INV-2026-0002`
- `REC-2026-0001` (receipts)

**Configuration Options (in Settings):**
| Option          | Type    | Default | Example       |
| :-------------- | :------ | :------ | :------------ |
| Prefix          | Text    | "INV"   | "TECH", "DEV" |
| Include Year    | Boolean | true    | 2026          |
| Include Month   | Boolean | false   | 02            |
| Separator       | Text    | "-"     | "/"           |
| Sequence Length | Number  | 4       | 0001          |

**Auto-Increment Logic:**
```typescript
// On new invoice creation
async function getNextNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const lastInvoice = await db.invoices
    .where('issueDate')
    .between(new Date(year, 0, 1), new Date(year, 11, 31))
    .last();
  
  const lastSeq = lastInvoice 
    ? parseInt(lastInvoice.number.split('-').pop() || '0')
    : 0;
  
  return formatInvoiceNumber(lastSeq + 1);
}
```

---

## Phase 2: Data Persistence

### 2.1 IndexedDB Storage (Dexie.js)

**Tables:**
| Table      | Purpose               | Indexes                             |
| :--------- | :-------------------- | :---------------------------------- |
| `senders`  | Saved sender profiles | businessName, isDefault             |
| `clients`  | Client address book   | name, company, email                |
| `services` | Service/item library  | name, category                      |
| `invoices` | All invoices          | number, status, clientId, issueDate |

---

### 2.2 Client Address Book

**Features:**
| Feature       | Description                          |
| :------------ | :----------------------------------- |
| Add Client    | Save current form data as new client |
| Edit Client   | Update existing client               |
| Delete Client | Remove with confirmation             |
| Search        | Filter by name, company, email       |
| Select        | Populate form from saved client      |

**UI:**
- Dropdown with search in Client section
- "Manage Clients" link to modal/page
- Recently used clients at top

---

### 2.3 Service/Item Library

**Features:**
| Feature        | Description                                           |
| :------------- | :---------------------------------------------------- |
| Add Service    | Save line item as reusable template                   |
| Edit Service   | Update name, rate, tax, unit                          |
| Delete Service | Remove from library                                   |
| Categories     | Optional grouping (e.g., "Development", "Consulting") |
| Quick Add      | Click to add to current invoice                       |

**Saved Fields per Service:**
- Name (used as description)
- Default rate
- Default unit
- Default tax rate
- Category (optional)

---

### 2.4 Invoice History

**List View:**
| Column    | Description                    |
| :-------- | :----------------------------- |
| Invoice # | e.g., INV-2026-0001            |
| Client    | Client name                    |
| Date      | Issue date                     |
| Total     | Formatted amount with currency |
| Status    | Draft, Sent, Paid, Overdue     |
| Actions   | View, Edit, Duplicate, Delete  |

**Features:**
- Sort by date, client, amount, status
- Filter by status
- Search by invoice number or client
- Pagination (20 per page)

---

### 2.5 Draft Auto-Save

**Behavior:**
- Save current form state every 30 seconds
- Save on blur (field loses focus)
- Save before closing browser (beforeunload)
- Recovery prompt on next visit if draft exists

---

## Phase 3: Templates

### 3.1 Classic Template

**Description:** Traditional, formal invoice layout.

**Characteristics:**
- Serif font optional
- Boxed sections
- Table with visible borders
- Conservative color usage (minimal brand color)

---

### 3.2 Modern Template

**Description:** Clean, minimal contemporary design (default).

**Characteristics:**
- Sans-serif typography (Inter)
- Generous whitespace
- Subtle borders (light gray)
- Brand color on header and totals

---

### 3.3 Tech Template

**Description:** Developer/tech-focused aesthetic.

**Characteristics:**
- Monospace font for numbers and invoice #
- Code-inspired styling (dark header option)
- Clean tables with no borders
- Minimal, functional design

---

### 3.4 Compact Template

**Description:** Dense layout for detailed invoices.

**Characteristics:**
- Smaller font sizes
- Compressed spacing
- Fits more line items per page
- Ideal for long itemized invoices

---

### Template Selector UI

- Dropdown or card-based selection
- Preview thumbnail for each template
- Live preview updates immediately on selection
- Saved preference in settings

---

## Phase 4: Receipt Mode

### 4.1 Receipt Generation

**Purpose:** Create payment confirmation documents.

**Differences from Invoice:**
| Aspect          | Invoice         | Receipt         |
| :-------------- | :-------------- | :-------------- |
| Purpose         | Request payment | Confirm payment |
| Title           | "INVOICE"       | "RECEIPT"       |
| Number Prefix   | INV             | REC             |
| Due Date        | Required        | N/A             |
| Paid Date       | N/A             | Required        |
| Payment Method  | N/A             | Optional        |
| Transaction Ref | N/A             | Optional        |

**Additional Receipt Fields:**
- Paid Date (required)
- Payment Method (Cash, Card, Bank Transfer, etc.)
- Transaction Reference / Check Number

---

### 4.2 Convert Invoice to Receipt

**Flow:**
1. Open invoice from history
2. Click "Convert to Receipt"
3. Add payment details (date, method, reference)
4. Generate receipt PDF
5. Optionally mark invoice as "Paid"

---

## Phase 5: Export/Import

### 5.1 Export Single Invoice (JSON)

**Use Case:** Share invoice data, backup individual records.

**Format:**
```json
{
  "version": "1.0",
  "type": "invoice",
  "data": {
    "number": "INV-2026-0001",
    "issueDate": "2026-02-01",
    "dueDate": "2026-03-03",
    "currency": "USD",
    "sender": { ... },
    "client": { ... },
    "lineItems": [ ... ],
    "discount": { ... },
    "notes": "...",
    "terms": "..."
  },
  "exportedAt": "2026-02-01T17:00:00Z"
}
```

---

### 5.2 Import Invoice (JSON)

**Behavior:**
- Validate JSON structure
- Show preview before import
- Option to create as new (generate new number) or restore original
- Merge sender/client with existing or create new

---

### 5.3 Full Backup Export

**Contents:**
```json
{
  "version": "1.0",
  "exportedAt": "2026-02-01T17:00:00Z",
  "data": {
    "senders": [ ... ],
    "clients": [ ... ],
    "services": [ ... ],
    "invoices": [ ... ],
    "settings": { ... }
  }
}
```

---

### 5.4 Full Backup Import

**Behavior:**
- Validate backup structure
- Show summary (X invoices, Y clients, etc.)
- Options:
  - **Merge**: Add to existing data
  - **Replace**: Clear all and restore
- Confirm before proceeding

---

## Phase 6: Polish & Settings

### 6.1 Settings Page

**Sections:**

**Invoice Defaults:**
- Default currency
- Default payment terms
- Default tax rate
- Invoice number format

**Appearance:**
- Theme (Light/Dark)
- Default template

**Data Management:**
- Export all data
- Import backup
- Clear all data (with confirmation)

---

### 6.2 Keyboard Shortcuts

| Shortcut                | Action         |
| :---------------------- | :------------- |
| `Ctrl/Cmd + S`          | Save draft     |
| `Ctrl/Cmd + D`          | Download PDF   |
| `Ctrl/Cmd + N`          | New invoice    |
| `Ctrl/Cmd + P`          | Print          |
| `Tab`                   | Next field     |
| `Shift + Tab`           | Previous field |
| `Enter` (in line items) | Add new row    |
| `Esc`                   | Close modal    |

---

### 6.3 Print Support

**Features:**
- Print-optimized CSS
- Removes UI elements
- Shows clean invoice only
- Triggers browser print dialog

---

## Feature Priority Matrix

| Feature             | Priority | Effort | Phase |
| :------------------ | :------- | :----- | :---- |
| Invoice Form        | P0       | High   | 1     |
| PDF Generation      | P0       | High   | 1     |
| Live Preview        | P0       | Medium | 1     |
| Invoice Number Gen  | P0       | Low    | 1     |
| IndexedDB Storage   | P1       | Medium | 2     |
| Client Address Book | P1       | Medium | 2     |
| Invoice History     | P1       | Medium | 2     |
| Service Library     | P2       | Medium | 2     |
| Multiple Templates  | P2       | High   | 3     |
| Receipt Mode        | P2       | Medium | 4     |
| Export/Import       | P2       | Medium | 5     |
| Settings Page       | P3       | Low    | 6     |
| Keyboard Shortcuts  | P3       | Low    | 6     |
| Light Theme         | P3       | Low    | 6     |

---

## Related Documents

- [Master Plan](./master-plan.md) - Project overview
- [Architecture](./architecture.md) - Technical details
- [UI/UX Design](./ui-ux.md) - Component specifications
- [Data Models](./data-models.md) - Schema definitions
