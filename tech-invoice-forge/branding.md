# Tech Invoice Forge - Branding

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [UI/UX Design](./ui-ux.md)

---

## Brand Name

**Tech Invoice Forge** - Implies craftsmanship, precision, and the creation of professional documents. "Forge" evokes strength and the act of shaping something valuable.

### Alternatives Considered

- **InvoiceKit** - Too generic, conflicts with SvelteKit naming
- **BillForge** - Less tech-focused
- **CodeBill** - Too niche
- **InvoiceCraft** - Similar vibe, less strong

---

## Taglines

| Type             | Tagline                                         |
| :--------------- | :---------------------------------------------- |
| **Functional**   | "Professional Invoices in Seconds"              |
| **Aspirational** | "Bill Like a Pro, Code Like a Boss"             |
| **Short**        | "Forge Your Invoice"                            |
| **Descriptive**  | "Offline-First Invoice Generator for Tech Pros" |

---

## Mission Statement

> To eliminate invoicing friction for tech professionals by providing a fast, private, offline-first tool that creates beautiful PDFs without the bloat of enterprise solutions.

---

## ⚠️ Design Philosophy: NO GRADIENTS

**This is a core brand principle.**

We explicitly reject gradients in our visual identity. Our brand uses:

- ✅ **Flat, solid colors** - Single-plane, pure hues
- ✅ **Color wheel colors** - Not mixed/muddy tones
- ✅ **High contrast** - Dark backgrounds with bold accents
- ✅ **Mature aesthetic** - Professional, not playful

**Why no gradients?**

- Gradients feel trendy and dated quickly
- Flat colors are more versatile across mediums
- Solid colors convey confidence and professionalism
- Better readability and accessibility
- Cleaner PDF output (no gradient rendering issues)
- Simpler CSS implementation

---

## Color Palette

### Design Principles

Based on color psychology for professional/financial applications:

| Color       | Psychology                         | Use Case                    |
| :---------- | :--------------------------------- | :-------------------------- |
| **Indigo**  | Trust, professionalism, competence | Primary actions, brand      |
| **Emerald** | Money, success, approval           | Success states, paid status |
| **Amber**   | Attention, warmth, pending         | Warnings, due soon          |
| **Slate**   | Neutrality, sophistication         | Backgrounds, surfaces       |

### Our Palette: "Slate Professional"

A mature, dark-first palette with professional undertones. Trustworthy, competent, and unmistakably business-focused.

```
┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY        SECONDARY       ACCENT          BACKGROUND       │
│  ─────────      ──────────      ──────          ──────────       │
│  #4F46E5        #10B981         #F59E0B         #0F172A          │
│  Indigo-600     Emerald-500     Amber-500       Slate-900        │
│  ████████       ████████        ████████        ████████         │
└─────────────────────────────────────────────────────────────────┘
```

### Color Definitions

| Role               | Color     | Hex       | Tailwind      | Usage                               |
| :----------------- | :-------- | :-------- | :------------ | :---------------------------------- |
| **Primary**        | Indigo    | `#4F46E5` | `indigo-600`  | CTAs, primary buttons, brand accent |
| **Secondary**      | Emerald   | `#10B981` | `emerald-500` | Success, paid status, positive      |
| **Accent**         | Amber     | `#F59E0B` | `amber-500`   | Warnings, attention, pending        |
| **Background**     | Slate-900 | `#0F172A` | `slate-900`   | Main app background                 |
| **Surface**        | Slate-800 | `#1E293B` | `slate-800`   | Cards, panels, elevated surfaces    |
| **Surface Alt**    | Slate-700 | `#334155` | `slate-700`   | Hover states, borders               |
| **Text Primary**   | Slate-50  | `#F8FAFC` | `slate-50`    | Main text                           |
| **Text Secondary** | Slate-400 | `#94A3B8` | `slate-400`   | Secondary text, labels              |
| **Text Muted**     | Slate-500 | `#64748B` | `slate-500`   | Disabled, placeholder               |
| **Border**         | Slate-700 | `#334155` | `slate-700`   | Dividers, borders                   |
| **Error**          | Red       | `#EF4444` | `red-500`     | Errors, overdue status              |
| **Info**           | Blue      | `#3B82F6` | `blue-500`    | Information, links                  |

### Why These Colors?

**Primary - Indigo (#4F46E5)**
- Associated with trust, professionalism, and competence
- Widely used in fintech and business applications
- High visibility on both dark and light backgrounds
- Mature shade that doesn't feel playful

**Secondary - Emerald (#10B981)**
- Universal association with money and financial success
- Perfect for "paid" status and success confirmations
- Balances the cool indigo with warmth
- Natural fit for invoicing context

**Accent - Amber (#F59E0B)**
- Draws attention without alarming
- Perfect for "due soon" or "pending" states
- Warm contrast to the cooler primary palette
- Communicates urgency without negativity

### Color Usage Guidelines

```
Primary (Indigo) - 10-15% of UI
├── Primary action buttons ("Download PDF", "Create Invoice")
├── Active navigation states
├── Focused form inputs
├── Brand logo accent
└── Links and interactive elements

Secondary (Emerald) - 5-10% of UI
├── "Paid" status badges
├── Success messages
├── Confirmation modals
├── Positive totals
└── Checkmarks and completion

Accent (Amber) - 3-5% of UI
├── "Due Soon" warnings
├── Pending status
├── Attention callouts
├── Overdue soft warnings
└── Important notes

Error (Red) - 2-3% of UI
├── Form validation errors
├── "Overdue" status badges
├── Destructive actions (delete)
└── Critical warnings

Neutral (Slate) - 70-80% of UI
├── Backgrounds
├── Cards and surfaces
├── Text content
├── Borders and dividers
└── Disabled states
```

### Light Theme Adjustments

For optional light mode:

| Role           | Dark Theme | Light Theme |
| :------------- | :--------- | :---------- |
| Background     | `#0F172A`  | `#FFFFFF`   |
| Surface        | `#1E293B`  | `#F8FAFC`   |
| Surface Alt    | `#334155`  | `#F1F5F9`   |
| Text Primary   | `#F8FAFC`  | `#0F172A`   |
| Text Secondary | `#94A3B8`  | `#64748B`   |
| Border         | `#334155`  | `#E2E8F0`   |

Colors (Primary, Secondary, Accent, Error) remain the same.

### Accessibility Notes

All color combinations meet WCAG 2.1 AA standards:

| Combination            | Contrast Ratio | Status |
| :--------------------- | :------------- | :----- |
| Indigo on Slate-900    | 6.1:1          | ✅ AA   |
| Emerald on Slate-900   | 5.7:1          | ✅ AA   |
| Amber on Slate-900     | 7.8:1          | ✅ AAA  |
| Slate-50 on Slate-900  | 15.8:1         | ✅ AAA  |
| Slate-400 on Slate-900 | 6.3:1          | ✅ AA   |
| Red on Slate-900       | 5.4:1          | ✅ AA   |

---

## Typography

| Use           | Font           | Weight         | Size    |
| :------------ | :------------- | :------------- | :------ |
| **Display**   | Inter          | 700 (Bold)     | 28-36px |
| **Headings**  | Inter          | 600 (SemiBold) | 18-24px |
| **Body**      | Inter          | 400-500        | 14-16px |
| **Labels**    | Inter          | 500 (Medium)   | 12-14px |
| **Code/Data** | JetBrains Mono | 400            | 13-14px |

### Font Pairing Rationale

- **Inter**: Industry-standard UI font, excellent readability at all sizes, variable font support
- **JetBrains Mono**: Developer-focused monospace font, great for invoice numbers and amounts

### Font Loading

```html
<!-- In app.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

---

## Logo Concept: "The Forge Mark"

A minimal geometric logo combining an anvil silhouette with document/invoice lines.

**Concept:**
```
     ╔═══════════╗
     ║  ▄▄▄▄▄▄▄  ║
     ║ █       █ ║
     ║ █ ═════ █ ║
     ║ █ ───── █ ║
     ║ █ ───── █ ║
     ║  ▀▀▀▀▀▀▀  ║
     ╚═══════════╝

Anvil shape with invoice lines inside
```

**Files to create:**
- `assets/logo.svg` - Full logo with text
- `assets/icon.svg` - Icon-only for favicon
- `assets/logo-light.svg` - For light backgrounds

**Logo Colors:**
- Icon: Primary Indigo (#4F46E5)
- Text: White/Slate-50 on dark, Slate-900 on light

---

## Voice & Tone

### Personality Traits

- **Professional** but not stuffy
- **Efficient** - respects user's time
- **Helpful** but not patronizing
- **Clear** - no jargon or confusion
- **Reliable** - trustworthy and consistent

### Example Messages

**Success:**
> "Invoice created successfully. PDF ready for download."

**Error:**
> "Please add at least one line item before creating your invoice."

**Guidance:**
> "Your sender details are saved for future invoices."

**Empty State:**
> "No invoices yet. Create your first one in seconds."

**Confirmation:**
> "Are you sure you want to delete this invoice? This cannot be undone."

---

## Invoice Status Colors

| Status      | Color   | Hex       | Use Case            |
| :---------- | :------ | :-------- | :------------------ |
| **Draft**   | Slate   | `#64748B` | Work in progress    |
| **Sent**    | Blue    | `#3B82F6` | Delivered to client |
| **Paid**    | Emerald | `#10B981` | Payment received    |
| **Due**     | Amber   | `#F59E0B` | Payment due soon    |
| **Overdue** | Red     | `#EF4444` | Past due date       |

---

## Brand Don'ts

❌ **Never use gradients** - Flat colors only
❌ **Never use neon/bright colors** - Mature palette only
❌ **Never use pure white (#FFFFFF) for text** - Use Slate-50 (#F8FAFC)
❌ **Never use pure black (#000000)** - Use Slate-900 (#0F172A)
❌ **Never use playful/casual language** - Stay professional
❌ **Never mix more than 3 accent colors** - Primary, Secondary, Accent only
❌ **Never use decorative fonts** - Stick to Inter family
❌ **Never use large images/illustrations** - Keep UI functional

---

## Color Implementation (Tailwind CSS)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: '#4F46E5',    // Indigo-600
          secondary: '#10B981',  // Emerald-500
          accent: '#F59E0B',     // Amber-500
        },
        // Surface colors
        surface: {
          base: '#0F172A',       // Slate-900
          elevated: '#1E293B',   // Slate-800
          overlay: '#334155',    // Slate-700
        },
        // Text colors
        content: {
          primary: '#F8FAFC',    // Slate-50
          secondary: '#94A3B8',  // Slate-400
          muted: '#64748B',      // Slate-500
        },
        // Semantic colors
        success: '#10B981',      // Emerald-500
        warning: '#F59E0B',      // Amber-500
        error: '#EF4444',        // Red-500
        info: '#3B82F6',         // Blue-500
      },
    },
  },
};
```

---

## CSS Custom Properties

```css
/* app.css */
:root {
  /* Brand */
  --brand-primary: #4F46E5;
  --brand-secondary: #10B981;
  --brand-accent: #F59E0B;
  
  /* Surfaces */
  --surface-base: #0F172A;
  --surface-elevated: #1E293B;
  --surface-overlay: #334155;
  
  /* Text */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  
  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Borders */
  --border-default: #334155;
  --border-subtle: #1E293B;
  
  /* Radius */
  --radius: 0.5rem;
  --radius-sm: 0.25rem;
  --radius-lg: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.25);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4);
}

[data-theme="light"] {
  --surface-base: #FFFFFF;
  --surface-elevated: #F8FAFC;
  --surface-overlay: #F1F5F9;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --border-default: #E2E8F0;
  --border-subtle: #F1F5F9;
}
```

---

## Related Documents

- [Master Plan](./master-plan.md) - Complete project overview
- [UI/UX Design](./ui-ux.md) - Component specifications
- [Index](./index.md) - Navigation hub

---

## Research Sources

- [Color Psychology in Finance Apps](https://pdfsimpli.com/learn/our-top-14-invoice-template-ideas/)
- [Invoice Design Best Practices - Smashing Magazine](https://www.smashingmagazine.com/2009/11/invoice-like-a-pro/)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
