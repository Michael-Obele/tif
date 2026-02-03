# Tech Invoice Forge - Data Models

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [Architecture](./architecture.md)

---

## Overview

All data is stored locally in the browser using IndexedDB through Dexie.js. No data is sent to any server.

---

## TypeScript Type Definitions

### Sender

```typescript
// $lib/db/schema.ts

export interface Sender {
  id?: number;
  businessName: string;
  address: string;
  email: string;
  phone?: string;
  taxId?: string;
  logo?: Blob | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Example
const sender: Sender = {
  id: 1,
  businessName: "Acme Development LLC",
  address: "123 Tech Lane\nSan Francisco, CA 94105\nUSA",
  email: "billing@acmedev.com",
  phone: "+1 (555) 123-4567",
  taxId: "12-3456789",
  logo: null,
  isDefault: true,
  createdAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-02-01")
};
```

---

### Client

```typescript
export interface Client {
  id?: number;
  name: string;
  company?: string;
  address: string;
  email: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example
const client: Client = {
  id: 1,
  name: "John Smith",
  company: "TechStartup Inc",
  address: "456 Innovation Blvd\nSuite 200\nNew York, NY 10001",
  email: "john@techstartup.com",
  phone: "+1 (555) 987-6543",
  notes: "Prefers invoices on the 1st of each month",
  createdAt: new Date("2026-01-20"),
  updatedAt: new Date("2026-01-20")
};
```

---

### Service Item

```typescript
export interface ServiceItem {
  id?: number;
  name: string;
  description: string;
  defaultRate: number;
  defaultUnit: Unit;
  taxRate: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Unit = 
  | 'hour' 
  | 'day' 
  | 'unit' 
  | 'flat' 
  | 'project' 
  | 'month' 
  | 'word' 
  | 'page';

// Example
const service: ServiceItem = {
  id: 1,
  name: "Frontend Development",
  description: "React/Svelte component development and integration",
  defaultRate: 75.00,
  defaultUnit: "hour",
  taxRate: 10,
  category: "Development",
  createdAt: new Date("2026-01-10"),
  updatedAt: new Date("2026-01-10")
};
```

---

### Line Item

```typescript
export interface LineItem {
  description: string;
  quantity: number;
  unit: Unit;
  rate: number;
  taxRate: number;
}

// Computed properties (not stored, calculated on render)
export interface LineItemWithTotal extends LineItem {
  amount: number;      // quantity * rate
  taxAmount: number;   // amount * (taxRate / 100)
  totalAmount: number; // amount + taxAmount
}

// Example
const lineItem: LineItem = {
  description: "Frontend development - User dashboard",
  quantity: 40,
  unit: "hour",
  rate: 75.00,
  taxRate: 10
};
// Computed: amount = $3,000, taxAmount = $300, totalAmount = $3,300
```

---

### Discount

```typescript
export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

// Examples
const percentageDiscount: Discount = { type: 'percentage', value: 10 }; // 10% off
const fixedDiscount: Discount = { type: 'fixed', value: 50 }; // $50 off
```

---

### Invoice

```typescript
export interface Invoice {
  id?: number;
  number: string;
  type: 'invoice' | 'receipt';
  status: InvoiceStatus;
  senderId: number;
  clientId: number;
  issueDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  currency: CurrencyCode;
  lineItems: LineItem[];
  discount: Discount;
  notes?: string;
  terms?: string;
  template: TemplateName;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus = 
  | 'draft' 
  | 'sent' 
  | 'paid' 
  | 'overdue'
  | 'cancelled';

export type PaymentMethod = 
  | 'bank_transfer' 
  | 'credit_card' 
  | 'paypal' 
  | 'cash' 
  | 'check' 
  | 'other';

export type TemplateName = 
  | 'modern' 
  | 'classic' 
  | 'tech' 
  | 'compact';

// Example
const invoice: Invoice = {
  id: 1,
  number: "INV-2026-0001",
  type: "invoice",
  status: "draft",
  senderId: 1,
  clientId: 1,
  issueDate: new Date("2026-02-01"),
  dueDate: new Date("2026-03-03"),
  currency: "USD",
  lineItems: [
    {
      description: "Frontend development - User dashboard",
      quantity: 40,
      unit: "hour",
      rate: 75.00,
      taxRate: 10
    },
    {
      description: "API integration - Payment gateway",
      quantity: 8,
      unit: "hour",
      rate: 85.00,
      taxRate: 10
    }
  ],
  discount: { type: "fixed", value: 50 },
  notes: "Thank you for your business!",
  terms: "Payment due within 30 days. Late payments subject to 1.5% monthly interest.",
  template: "modern",
  createdAt: new Date("2026-02-01"),
  updatedAt: new Date("2026-02-01")
};
```

---

### Settings

```typescript
export interface AppSettings {
  theme: 'light' | 'dark';
  defaultCurrency: CurrencyCode;
  defaultTemplate: TemplateName;
  defaultPaymentTerms: PaymentTerms;
  defaultTaxRate: number;
  invoiceNumberConfig: InvoiceNumberConfig;
  dateFormat: DateFormat;
}

export interface InvoiceNumberConfig {
  prefix: string;
  includeYear: boolean;
  includeMonth: boolean;
  separator: string;
  padLength: number;
}

export type PaymentTerms = 
  | 'due_on_receipt' 
  | 'net_7' 
  | 'net_15' 
  | 'net_30' 
  | 'net_45' 
  | 'net_60';

export type DateFormat = 
  | 'YYYY-MM-DD'     // 2026-02-01
  | 'MM/DD/YYYY'     // 02/01/2026
  | 'DD/MM/YYYY'     // 01/02/2026
  | 'MMM DD, YYYY'   // Feb 01, 2026
  | 'DD MMM YYYY';   // 01 Feb 2026

// Default settings
const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultCurrency: 'USD',
  defaultTemplate: 'modern',
  defaultPaymentTerms: 'net_30',
  defaultTaxRate: 0,
  invoiceNumberConfig: {
    prefix: 'INV',
    includeYear: true,
    includeMonth: false,
    separator: '-',
    padLength: 4
  },
  dateFormat: 'MMM DD, YYYY'
};
```

---

### Currency

```typescript
export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
  decimalPlaces: number;
}

export type CurrencyCode = 
  | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' 
  | 'JPY' | 'CNY' | 'INR' | 'NGN' | 'CHF'
  | 'BRL' | 'MXN' | 'KRW' | 'SGD' | 'HKD'
  | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'ZAR'
  | 'NZD' | 'AED' | 'SAR' | 'THB' | 'MYR';

// Complete currency list in constants
export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', decimalPlaces: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', decimalPlaces: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', decimalPlaces: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', locale: 'en-CA', decimalPlaces: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', decimalPlaces: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', decimalPlaces: 0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN', decimalPlaces: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', decimalPlaces: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', locale: 'en-NG', decimalPlaces: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH', decimalPlaces: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR', decimalPlaces: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', locale: 'es-MX', decimalPlaces: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR', decimalPlaces: 0 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG', decimalPlaces: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'zh-HK', decimalPlaces: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE', decimalPlaces: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', locale: 'nb-NO', decimalPlaces: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', locale: 'da-DK', decimalPlaces: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', locale: 'pl-PL', decimalPlaces: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA', decimalPlaces: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', locale: 'en-NZ', decimalPlaces: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', locale: 'ar-AE', decimalPlaces: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', locale: 'ar-SA', decimalPlaces: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', locale: 'th-TH', decimalPlaces: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY', decimalPlaces: 2 }
];
```

---

## Dexie.js Database Schema

```typescript
// $lib/db/index.ts
import Dexie, { type Table } from 'dexie';
import type { Sender, Client, ServiceItem, Invoice } from './schema';

class InvoiceForgeDB extends Dexie {
  senders!: Table<Sender>;
  clients!: Table<Client>;
  services!: Table<ServiceItem>;
  invoices!: Table<Invoice>;

  constructor() {
    super('InvoiceForgeDB');
    
    this.version(1).stores({
      // Indexes: ++id = auto-increment primary key
      // Other fields are indexed for querying
      senders: '++id, businessName, isDefault, createdAt',
      clients: '++id, name, company, email, createdAt',
      services: '++id, name, category, createdAt',
      invoices: '++id, number, type, status, clientId, senderId, issueDate, createdAt'
    });
  }
}

export const db = new InvoiceForgeDB();
```

---

## Validation Schemas (Valibot)

```typescript
// $lib/schemas/invoice.ts
import * as v from 'valibot';

export const SenderSchema = v.object({
  businessName: v.pipe(
    v.string(),
    v.minLength(1, 'Business name is required'),
    v.maxLength(100)
  ),
  address: v.pipe(
    v.string(),
    v.minLength(5, 'Address is required'),
    v.maxLength(500)
  ),
  email: v.pipe(
    v.string(),
    v.email('Invalid email format')
  ),
  phone: v.optional(
    v.pipe(v.string(), v.maxLength(30))
  ),
  taxId: v.optional(
    v.pipe(v.string(), v.maxLength(50))
  ),
  logo: v.optional(v.nullable(v.blob()))
});

export const ClientSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, 'Client name is required'),
    v.maxLength(100)
  ),
  company: v.optional(
    v.pipe(v.string(), v.maxLength(100))
  ),
  address: v.pipe(
    v.string(),
    v.minLength(5, 'Address is required'),
    v.maxLength(500)
  ),
  email: v.pipe(
    v.string(),
    v.email('Invalid email format')
  ),
  phone: v.optional(
    v.pipe(v.string(), v.maxLength(30))
  )
});

export const LineItemSchema = v.object({
  description: v.pipe(
    v.string(),
    v.minLength(1, 'Description is required'),
    v.maxLength(500)
  ),
  quantity: v.pipe(
    v.number(),
    v.minValue(0.01, 'Quantity must be greater than 0')
  ),
  unit: v.picklist(['hour', 'day', 'unit', 'flat', 'project', 'month', 'word', 'page']),
  rate: v.pipe(
    v.number(),
    v.minValue(0, 'Rate cannot be negative')
  ),
  taxRate: v.pipe(
    v.number(),
    v.minValue(0),
    v.maxValue(100, 'Tax rate cannot exceed 100%')
  )
});

export const InvoiceSchema = v.object({
  number: v.pipe(
    v.string(),
    v.minLength(1, 'Invoice number is required')
  ),
  type: v.picklist(['invoice', 'receipt']),
  status: v.picklist(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  issueDate: v.date(),
  dueDate: v.optional(v.nullable(v.date())),
  currency: v.string(),
  lineItems: v.pipe(
    v.array(LineItemSchema),
    v.minLength(1, 'At least one line item is required')
  ),
  discount: v.object({
    type: v.picklist(['percentage', 'fixed']),
    value: v.pipe(
      v.number(),
      v.minValue(0, 'Discount cannot be negative')
    )
  }),
  notes: v.optional(
    v.pipe(v.string(), v.maxLength(2000))
  ),
  terms: v.optional(
    v.pipe(v.string(), v.maxLength(5000))
  ),
  template: v.picklist(['modern', 'classic', 'tech', 'compact'])
});
```

---

## Export/Import Formats

### Single Invoice Export

```typescript
interface InvoiceExport {
  version: '1.0';
  type: 'invoice';
  exportedAt: string; // ISO date
  data: {
    invoice: Invoice;
    sender: Sender;
    client: Client;
  };
}
```

### Full Backup Export

```typescript
interface FullBackup {
  version: '1.0';
  type: 'full_backup';
  exportedAt: string;
  data: {
    senders: Sender[];
    clients: Client[];
    services: ServiceItem[];
    invoices: Invoice[];
    settings: AppSettings;
  };
  meta: {
    invoiceCount: number;
    clientCount: number;
    serviceCount: number;
  };
}
```

---

## Computed Values

### Invoice Calculations

```typescript
// $lib/utils/calculations.ts

export function calculateLineItemAmount(item: LineItem): number {
  return item.quantity * item.rate;
}

export function calculateLineItemTax(item: LineItem): number {
  const amount = calculateLineItemAmount(item);
  return amount * (item.taxRate / 100);
}

export function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => 
    sum + calculateLineItemAmount(item), 0
  );
}

export function calculateTaxTotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => 
    sum + calculateLineItemTax(item), 0
  );
}

export function calculateDiscountAmount(
  subtotal: number, 
  discount: Discount
): number {
  if (discount.type === 'percentage') {
    return subtotal * (discount.value / 100);
  }
  return Math.min(discount.value, subtotal); // Can't discount more than subtotal
}

export function calculateTotal(
  lineItems: LineItem[], 
  discount: Discount
): number {
  const subtotal = calculateSubtotal(lineItems);
  const taxTotal = calculateTaxTotal(lineItems);
  const discountAmount = calculateDiscountAmount(subtotal, discount);
  
  return subtotal + taxTotal - discountAmount;
}
```

---

## Related Documents

- [Architecture](./architecture.md) - Database setup
- [Features](./features.md) - Feature specifications
- [Dependencies](./dependencies.md) - Package requirements
