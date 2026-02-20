# 🛠️ Tech Invoice Forge (TIF)

[![License: MIT](https://img.shields.io/badge/License-MIT-slate.svg)](https://opensource.org/licenses/MIT)
[![Svelte](https://img.shields.io/badge/Svelte-5-orange.svg)](https://svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-Fast-black.svg)](https://bun.sh/)
[![Offline First](https://img.shields.io/badge/Architecture-Offline--First-indigo.svg)](#-architecture)
[![GitHub stars](https://img.shields.io/github/stars/Michael-Obele/tif?style=social)](https://github.com/Michael-Obele/tif)

**Tech Invoice Forge** is a professional-grade, offline-first invoice and receipt generator designed specifically for tech professionals. Unlike bloated SaaS solutions, TIF runs entirely in your browser, providing instant PDF generation without accounts, subscriptions, or backend dependencies.

[**Live Demo**](https://tif.svelte-apps.me) | [**Report Bug**](https://github.com/Michael-Obele/tif/issues) | [**Request Feature**](https://github.com/Michael-Obele/tif/issues)

---

<div align="center">
  <img src="./static/dashboard-preview.png" alt="Dashboard Preview" width="100%" />
</div>

## 🆚 Why Tech Invoice Forge?

| Feature           | Tech Invoice Forge        | Invoice Ninja         | Wave                  | FreshBooks            |
| ----------------- | ------------------------- | --------------------- | --------------------- | --------------------- |
| **Offline-First** | ✅ **100% Client-Side**   | ❌ Cloud Required     | ❌ Cloud Only         | ❌ Cloud Only         |
| **Privacy**       | ✅ **Local IndexedDB**    | ⚠️ Cloud Storage      | ⚠️ Cloud Storage      | ⚠️ Cloud Storage      |
| **No Account**    | ✅ **Zero Signup**        | ❌ Account Required   | ❌ Account Required   | ❌ Account Required   |
| **Cost**          | ✅ **Free & Open Source** | 💰 Paid Tiers         | 💰 Paid Features      | 💰 Subscription       |
| **Instant PDF**   | ✅ **Real-time (<100ms)** | ⚠️ Delayed Generation | ⚠️ Delayed Generation | ⚠️ Delayed Generation |

---

## 🚀 Key Features

- **⚡ Real-time Forge**: Watch your PDF update instantly as you type.
- **🛡️ Local Persistence**: All data stored in your browser's IndexedDB. Zero server tracking.
- **💰 Smart Calculations**: Automatic handling of taxes, discounts, and currencies.
- **📄 Professional PDFs**: High-precision vector PDFs powered by `pdfmake`.
- **👥 Client Management**: Save and manage your client roster for one-click billing.
- **📱 Responsive**: Built with Tailwind CSS v4 for mobile, tablet, and desktop.
- **🌙 Dark Mode**: "Slate Professional" theme designed for eye comfort.

### Invoice History

![Invoice History](./static/history-preview.png)
_All your invoices are stored locally in your browser._

---

## 🏗️ How It Works

1.  **Create Invoice**: Fill in client details, line items, and payment terms.
2.  **Live Preview**: See the PDF update instantly as you type.
3.  **Save Locally**: Your invoice is auto-saved to your browser.
4.  **Export**: Download the PDF or JSON data anytime.

---

## 🧰 The Tech Stack

| Category           | Technology                                                                                                               |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Framework**      | [Svelte 5 (Runes)](https://svelte.dev/)                                                                                  |
| **Meta-Framework** | [SvelteKit 2](https://kit.svelte.dev/)                                                                                   |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)                                                                              |
| **Database**       | Native IndexedDB                                                                                                         |
| **Validation**     | [Valibot](https://valibot.dev/)                                                                                          |
| **PDF Engine**     | [pdfmake](http://pdfmake.org/)                                                                                           |
| **Iconography**    | [Lucide Svelte](https://lucide.dev/)                                                                                     |
| **Components**     | [shadcn-svelte](https://www.shadcn-svelte.com/)                                                                          |
| **Utilities**      | [Mode Watcher](https://github.com/ignatiusmb/mode-watcher), [Svelte Sonner](https://github.com/wobsoriano/svelte-sonner) |
| **Runtime**        | [Bun](https://bun.sh/)                                                                                                   |

---

## ⚙️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js 20+

### Installation

```bash
# Clone the repository
git clone https://github.com/Michael-Obele/tif.git

# Navigate to the project directory
cd tif

# Install dependencies
bun install
```

### Development

Start the development server with hot-reloading:
❓ Frequently Asked Questions

<details>
<summary><b>Is my data really private?</b></summary>
Yes! TIF uses IndexedDB which stores data ONLY in your browser. No data is ever transmitted to any server. You have complete control and ownership.
</details>

<details>
<summary><b>Can I export my data?</b></summary>
Absolutely. You can export invoices as PDFs and client data as JSON. Use the Export button in the invoice history view.
</details>

<details>
<summary><b>Does it work offline?</b></summary>
Yes! Once loaded, TIF works completely offline.
</details>

---

## 🔧 Troubleshooting

<details>
We welcome contributions! Please see our guidelines below:

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  eck if your browser is in Private/Incognito mode, which doesn't persist IndexedDB data. Use regular browsing mode.
</details>

---

##

```bash
bun dev
```

Visit `http://localhost:5173` to start forging.

---

## 🏗️ Architecture

TIF uses a **Local-First Architecture**. There is no backend API.

- **Storage**: All data is persisted in the browser's `IndexedDB`.
- **Logic**: Svelte 5 Runes manage reactive state for sub-100ms UI interactions.
- **Validation**: `Valibot` ensures data integrity before persistence.
- **Rendering**: PDF generation is handled in a separate thread/module to maintain 60FPS UI performance.

---

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Michael Obele**

- [GitHub](https://github.com/Michael-Obele)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the Tech Community by Tech Invoice Forge
</p>
