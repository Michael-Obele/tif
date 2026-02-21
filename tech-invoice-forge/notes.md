# Tech Invoice Forge - Notes

[← Back to Index](./index.md) | [Master Plan](./master-plan.md)

---

## Research Insights

### Invoice App Market Analysis

**Key Competitors Analyzed:**

- Zoho Invoice - Feature-rich, subscription-based
- Wave - Free, ad-supported
- Invoice Simple - Mobile-first, simple
- Bookipi - Mobile-focused
- Free Invoice Builder - Web-based, simple

**Common Features Across All:**

1. PDF generation
2. Client management
3. Line item editing
4. Tax calculations
5. Custom templates

**Differentiating Feature Opportunities:**

1. **Offline-first** - Most competitors require internet
2. **No account required** - Instant start
3. **Tech-focused** - Templates for developers
4. **Privacy** - No data leaves browser

---

### PDF Generation Libraries Comparison

| Library     | Pros                       | Cons                 | Verdict   |
| :---------- | :------------------------- | :------------------- | :-------- |
| **pdfmake** | Declarative, tables, fonts | Bundle size          | ✅ CHOSEN |
| jsPDF       | Small, simple              | Poor table support   | ❌        |
| pdf-lib     | Edit existing PDFs         | Complex for creation | ❌        |
| Puppeteer   | HTML to PDF                | Server-side only     | ❌        |

**pdfmake Benefits:**

- Works in browser (no server)
- Excellent table support (critical for invoices)
- Custom fonts possible
- Good documentation
- Active maintenance

**pdfmake Considerations:**

- ~500KB bundle (mitigated by lazy loading)
- Font embedding adds complexity
- Learning curve for document definitions

---

### IndexedDB vs Other Storage Options

| Option        | Size Limit | Persistence | Complexity |
| :------------ | :--------- | :---------- | :--------- |
| localStorage  | 5-10MB     | Good        | Low        |
| **IndexedDB** | 50MB+      | Good        | Medium     |
| Cookie        | 4KB        | Low         | Low        |
| OPFS          | Unlimited  | Great       | High       |

**Why IndexedDB (Native):**

- Stores complex objects (invoices, logos)
- Query capabilities (filter by date, status)
- Larger storage limit
- Zero external dependencies
- Works offline

---

### Native IndexedDB + SvelteKit SSR Compatibility

⚠️ **Critical Finding:** IndexedDB is a browser-only API. SvelteKit's SSR will fail if IndexedDB is accessed at module level or during server rendering.

**The Problem:**

```
ReferenceError: indexedDB is not defined
```

**Solution: Disable SSR (Recommended for This Project)**

Since Tech Invoice Forge is offline-first and client-side only:

```typescript
// src/routes/+layout.ts
export const ssr = false;
export const prerender = true; // Still prerender the HTML shell
```

This is the **cleanest approach** for an offline-first, no-backend app. It allows us to import the `db` instance anywhere without worrying about server-side errors.

**Implementation Note:**
The project uses a custom, promise-based wrapper around the native IndexedDB API. This provides a clean interface similar to `idb` but with zero dependencies and specific optimizations for the invoice generation workflow.

**Svelte 5 Runes + Database Compatibility:**

Since we use native IndexedDB, we handle reactivity via Svelte 5 runes (`$state`, `$derived`, `$effect`). When the database updates, we manually refresh the relevant state in our stores.

---

### Svelte 5 Runes Patterns

**State Management Approach:**

```typescript
// Class-based store with runes
class InvoiceStore {
  invoice = $state<Invoice>({ ... });

  subtotal = $derived.by(() => {
    return this.invoice.lineItems.reduce(...);
  });

  addLineItem(item: LineItem) {
    this.invoice.lineItems = [...this.invoice.lineItems, item];
  }
}

export const store = new InvoiceStore();
```

**Key Insights:**

- Use `$state` for mutable data
- Use `$derived.by()` for computed values
- Classes allow encapsulating state + methods
- Export single instance for global state

---

### Currency Formatting

**Best Practice: Use Intl.NumberFormat**

```typescript
function formatCurrency(amount: number, currency: string, locale?: string): string {
	return new Intl.NumberFormat(locale || 'en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}

// Examples:
formatCurrency(1234.56, 'USD'); // "$1,234.56"
formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"
formatCurrency(1234, 'JPY', 'ja-JP'); // "¥1,234"
```

**Edge Cases:**

- JPY and KRW have 0 decimal places
- Some currencies have different grouping
- Currency symbol position varies by locale

---

### Invoice Number Patterns

**Common Formats:**

- `INV-2026-0001` - Year-based reset
- `2026020001` - Date-based
- `A-001` - Alphabetic prefix
- `001` - Simple sequential

**Chosen Format: `{PREFIX}-{YEAR}-{SEQUENCE}`**

Reasons:

- Clear and professional
- Year helps organize records
- Configurable prefix
- Zero-padded sequence (0001-9999)

---

## Design Decisions

### Why No Backend?

**Benefits:**

1. **Privacy** - User data never leaves their device
2. **Speed** - No network latency
3. **Cost** - No server to maintain
4. **Simplicity** - Easier development
5. **Offline** - Works without internet

**Trade-offs:**

1. No cross-device sync (mitigated by export/import)
2. No multi-user (not a requirement)
3. Data at risk if browser cleared (mitigated by backup export)

---

### Why Dark Mode Default?

1. **Developer audience** - Prefers dark themes
2. **PDF preview** - White PDF pops on dark background
3. **Modern aesthetic** - Aligns with brand
4. **Eye strain** - Better for long work sessions

Light mode remains an option for user preference.

---

### Template Selection

**Four templates chosen based on research:**

1. **Modern** (default) - Covers 60% of users
2. **Classic** - Corporate clients prefer formal
3. **Tech** - Differentiator for developer audience
4. **Compact** - Practical for detailed invoices

Future: Allow custom template creation?

---

## Known Limitations

### Browser Compatibility

| Feature       | Chrome | Firefox | Safari | Edge |
| :------------ | :----- | :------ | :----- | :--- |
| IndexedDB     | ✅     | ✅      | ✅     | ✅   |
| File Download | ✅     | ✅      | ✅     | ✅   |
| PDF Blob URL  | ✅     | ✅      | ⚠️     | ✅   |

**Safari Considerations:**

- PDF preview might need fallback
- IndexedDB has quirks in private mode
- Test thoroughly on iOS Safari

---

### Storage Limits

**IndexedDB Limits:**

- Chrome: 60% of disk space
- Firefox: 10% of disk space (min 50MB)
- Safari: 500MB+ with user prompt

**Mitigation:**

- Show storage usage in settings
- Offer data cleanup for old invoices
- Prominent backup export feature

---

### PDF Limitations

**pdfmake Constraints:**

- Limited SVG support
- No HTML-to-PDF conversion
- Custom fonts require embedding
- Complex layouts can be challenging

**Workarounds:**

- Convert logos to base64
- Stick to structured layouts
- Use standard PDF fonts (Helvetica, Times)

---

## Questions to Resolve

### User Experience

- [ ] Should line items auto-focus when added?
- [ ] Tab order through form - what feels natural?
- [ ] Preview always visible or toggleable on mobile?

### Technical

- [ ] Best way to handle logo image compression?
- [ ] Debounce timing for preview updates (300ms?)
- [ ] How to handle PDF generation errors gracefully?

### Business

- [x] Monetization options? → **Free forever + appreciation payments**
- [ ] Custom domain vs free hosting?
- [ ] Add analytics tracking? (privacy-first approach)

---

## Monetization Strategy: Free Forever

### Philosophy

Tech Invoice Forge will **always remain 100% free**. No paywalls, no premium tiers, no feature gates. Users who appreciate the tool can optionally support development.

### Why Free Forever?

1. **Target audience** - Freelancers often starting out, cost-sensitive
2. **Differentiation** - Most competitors are subscription-based
3. **Trust** - No "freemium bait" or future paywall concerns
4. **Privacy** - No accounts means no upselling
5. **Simplicity** - Focus on product, not billing

### Appreciation Payment Options

| Platform            | Fee  | Best For                  |
| :------------------ | :--- | :------------------------ |
| **Ko-fi**           | 0%   | One-time "coffees" ($3-5) |
| **Buy Me a Coffee** | 5%   | One-time + memberships    |
| **GitHub Sponsors** | 0%   | Open source community     |
| **PayPal.me**       | 2.9% | Direct donations          |

**Recommendation:** Use **Ko-fi** (zero fees) + **GitHub Sponsors** (open source credibility).

### Pricing Page Design

Create a `/pricing` (or `/support`) page with:

```markdown
# Support Tech Invoice Forge

**This app is free. Forever. No catch.**

Built with ❤️ as an open-source project. If it saves you time or makes
your business look more professional, consider buying me a coffee.

[☕ Buy me a coffee on Ko-fi] → ko-fi.com/techinvoiceforge
[💖 Sponsor on GitHub] → github.com/sponsors/Michael-Obele

---

## Why Free?

- No accounts, no data collection, no upselling
- Your data stays in YOUR browser
- Open source: github.com/Michael-Obele/tech-invoice-forge

## Want to Help Without Paying?

- ⭐ Star the repo on GitHub
- 📢 Share with fellow freelancers
- 🐛 Report bugs or suggest features
```

### Optional Future Revenue (Post-MVP)

| Revenue Stream          | Implementation     | Priority |
| :---------------------- | :----------------- | :------- |
| Custom template designs | Gumroad/Ko-fi shop | P2       |
| White-label version     | Direct sales       | P3       |
| Enterprise support      | Contact form       | P3       |

---

## Branding Image Feature

### Overview

Allow users to optionally add their business logo to invoices. This enhances professionalism without requiring a paid tier.

### Implementation

**Storage:** Logo stored as base64 in IndexedDB (via Dexie.js)  
**Format:** Accept PNG, JPG, SVG (recommend PNG for best PDF results)  
**Size Limit:** Max 500KB, auto-compress if larger  
**Dimensions:** Recommend 200x200px, auto-resize for PDF

### User Flow

1. User clicks "Add Logo" in Sender section
2. File picker opens (accept image/\*)
3. Preview shows in form
4. Logo saved to `senders` table in IndexedDB
5. Logo appears in PDF preview automatically

### Technical Considerations

```typescript
// Logo compression utility
async function compressLogo(file: File, maxSize = 500 * 1024): Promise<string> {
	// If already small enough, just convert to base64
	if (file.size <= maxSize) {
		return await fileToBase64(file);
	}

	// Use canvas to resize/compress
	const img = await loadImage(file);
	const canvas = document.createElement('canvas');
	// Resize to max 400px while maintaining aspect ratio
	const scale = Math.min(400 / img.width, 400 / img.height);
	canvas.width = img.width * scale;
	canvas.height = img.height * scale;

	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	return canvas.toDataURL('image/png', 0.8);
}
```

### PDF Template Integration

```typescript
// In pdfmake template
{
	columns: [
		sender.logo
			? { image: sender.logo, width: 80, height: 80, fit: [80, 80] }
			: { text: sender.businessName, style: 'businessName' }
		// ... rest of header
	];
}
```

---

## Inspiration Sources

### Invoice Templates

- [Canva Invoice Templates](https://www.canva.com/invoice/templates/)
- [Behance Invoice UI Designs](https://www.behance.net/search/projects/invoice%20ui%20design)
- [Dribbble Invoice Apps](https://dribbble.com/tags/invoice_app)

### Existing Svelte Invoice Apps

- [Easy Invoicer](https://easwee.github.io/easy-invoicer/) - pdfmake example
- [Invoice-r](https://madewithsvelte.com/invoice-r) - Simple approach

### Color Palette Ideas

- [Tailwind Indigo](https://tailwindcss.com/docs/customizing-colors)
- [Flat UI Colors](https://flatuicolors.com/)
- [Coolors Palette Generator](https://coolors.co/)

---

## Development Notes

### Potential Gotchas

1. **pdfmake VFS fonts** - Must be loaded before generating PDF
2. **Dexie.js on SSR** - Only works in browser, guard with `browser` check
3. **Date handling** - Use @internationalized/date consistently
4. **Tailwind v4** - New config syntax, no tailwind.config.js
5. **Svelte 5 reactivity** - Remember $state for mutations

### Performance Tips

1. **Lazy load pdfmake** - 500KB is significant
2. **Debounce preview** - Don't regenerate on every keystroke
3. **Use $derived** - Don't recalculate in render
4. **Virtualize history list** - If many invoices

---

## Related Documents

- [Master Plan](./master-plan.md) - Project overview
- [Architecture](./architecture.md) - Technical details
- [Index](./index.md) - Navigation hub
