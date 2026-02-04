---
title: 'Tech Invoice Forge'
status: draft
owner: '@Michael-Obele'
tags: [invoice, pdf, svelte, web-app, freelance]
estimated_time: '3-4 weeks'
prototype: false
---

# Tech Invoice Forge - Professional Invoice & Receipt Generator

> A sleek, offline-first web application for creating professional invoices and receipts tailored for tech freelancers, consultants, and software developers. Built with SvelteKit, Svelte 5, shadcn-svelte, and pdfmake for instant PDF generation.

**Status:** Ready for Development  
**Owner:** @Michael-Obele  
**Estimated Time:** 3-4 Weeks MVP  
**Last Updated:** February 2026

---

## 🎨 Brand Colors: "Slate Professional"

| Role           | Color     | Hex       |
| :------------- | :-------- | :-------- |
| **Primary**    | Indigo    | `#4F46E5` |
| **Secondary**  | Emerald   | `#10B981` |
| **Accent**     | Amber     | `#F59E0B` |
| **Background** | Slate     | `#0F172A` |
| **Surface**    | Slate-800 | `#1E293B` |

> ⚠️ **NO GRADIENTS** - Flat, single-plane colors only. See [Branding](./branding.md) for details.

---

## 🎯 Quick Links

| Document                                   | Purpose                            | Status      |
| :----------------------------------------- | :--------------------------------- | :---------- |
| [📋 **Master Plan**](./master-plan.md)     | Complete consolidated reference    | ✅ Complete |
| [🏗️ **Architecture**](./architecture.md)   | Technical stack, data models, API  | ✅ Complete |
| [⚡ **Features**](./features.md)           | All features with specifications   | ✅ Complete |
| [🎨 **UI/UX Design**](./ui-ux.md)          | Components, layouts, user flows    | ✅ Complete |
| [🎭 **Branding**](./branding.md)           | Brand identity, colors, typography | ✅ Complete |
| [📄 **PDF Templates**](./pdf-templates.md) | Invoice/receipt template designs   | ✅ Complete |
| [💾 **Data Models**](./data-models.md)     | Schema definitions and storage     | ✅ Complete |
| [📦 **Dependencies**](./dependencies.md)   | NPM packages and tooling           | ✅ Complete |
| [✅ **Todos**](./todos.md)                 | Implementation checklist           | ✅ Complete |

---

## 🛠️ Tech Stack

| Layer         | Technology                      | Purpose                     |
| :------------ | :------------------------------ | :-------------------------- |
| **Framework** | SvelteKit 2 + Svelte 5 (Runes)  | Web application             |
| **Styling**   | Tailwind CSS v4 + shadcn-svelte | UI components               |
| **PDF**       | pdfmake                         | Client-side PDF generation  |
| **Storage**   | Native IndexedDB API            | Local data persistence      |
| **Forms**     | HTML forms + Valibot            | Remote functions validation |
| **Auth**      | Better Auth (optional)          | Future cloud sync           |
| **Date**      | @internationalized/date         | Date handling               |
| **Currency**  | Intl.NumberFormat (native)      | Currency formatting         |
| **Icons**     | Lucide Svelte                   | Icon system                 |

---

## 💡 Core Value Propositions

1. **Instant PDF Generation** - Create and download professional PDFs in seconds
2. **Offline-First** - Works without internet; data stored locally in browser
3. **Tech-Focused Templates** - Pre-built templates for software development, consulting, SaaS
4. **Smart Auto-Complete** - Remember clients, services, and recurring items
5. **Multi-Currency** - Support for 150+ currencies with proper formatting
6. **No Account Required** - Start using immediately; no signup friction

---

## 🎯 Target Users

| Persona                 | Needs                                           |
| :---------------------- | :---------------------------------------------- |
| **Freelance Developer** | Quick invoices for project milestones           |
| **Tech Consultant**     | Hourly billing with detailed breakdowns         |
| **SaaS Founder**        | Professional receipts for enterprise clients    |
| **Agency Owner**        | Multiple client invoices with consistent format |
| **Contractor**          | Recurring invoices for retainer clients         |

---

## 📊 Key Features

### Invoice Creation

- Line item management (description, quantity, rate, tax)
- Auto-calculations (subtotal, tax, discount, total)
- Custom invoice numbering (e.g., `INV-2026-001`)
- Due date and payment terms
- Notes and terms sections

### Receipt Generation

- Payment confirmation details
- Transaction reference numbers
- Simplified single-page format
- Digital signature placeholder

### Templates

- **Classic** - Traditional professional layout
- **Modern** - Clean, minimal design
- **Tech** - Developer-focused with monospace touches
- **Compact** - Single-page dense format

### Data Management

- Client address book (saved locally)
- Service/item library
- Invoice history and drafts
- Export/import JSON backup

---

## 🚀 Getting Started

1. Read the [Master Plan](./master-plan.md) for complete overview
2. Review [Architecture](./architecture.md) for technical setup
3. Check [Dependencies](./dependencies.md) for required packages
4. Follow [Todos](./todos.md) for implementation steps

---

## 📚 External Resources

- [pdfmake Docs](https://pdfmake.github.io/docs/) - PDF generation
- [MDN IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Native Web API
- [shadcn-svelte](https://shadcn-svelte.com) - UI components
- [Valibot Docs](https://valibot.dev) - Schema validation
- [Better Auth Docs](https://www.better-auth.com/docs) - Authentication (optional)
- [Intl.NumberFormat MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) - Currency formatting

---

## � Pricing Model

**Free. Forever. No catch.**

Tech Invoice Forge is 100% free with no paywalls, premium tiers, or feature gates. Users who appreciate the tool can optionally support development through:

- ☕ [Ko-fi](https://ko-fi.com) - One-time "coffee" donations
- 💖 GitHub Sponsors - Open source community support

See [Notes → Monetization Strategy](./notes.md#monetization-strategy-free-forever) for full details.

---

## �🔮 Future Considerations

- **Cloud Sync** - Optional account for cross-device sync (with Better Auth)
- **Email Integration** - Send invoices directly from app
- **Payment Links** - Stripe/PayPal integration
- **Recurring Invoices** - Automated invoice scheduling
- **Multi-language** - i18n for global users
- **Custom Templates** - User-created PDF designs (Ko-fi shop)

---

> _"Creating an invoice shouldn't feel like work. Tech Invoice Forge makes billing as smooth as deploying to production."_
