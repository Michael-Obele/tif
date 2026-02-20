# Contributing to Tech Invoice Forge

First off, thanks for taking the time to contribute! 🎉

Tech Invoice Forge is an open-source project that thrives on community contributions. Whether it's fixing a bug, adding a new feature, or improving documentation, we appreciate your help.

## 🛠️ Development Setup

We use [Bun](https://bun.sh/) as our package manager and runtime.

1.  **Fork and Clone**

    ```bash
    git clone https://github.com/YOUR_USERNAME/tif.git
    cd tif
    ```

2.  **Install Dependencies**

    ```bash
    bun install
    ```

3.  **Start Development Server**
    ```bash
    bun dev
    ```
    Visit `http://localhost:5173` to see your changes.

## 🧪 Quality Gate

Before submitting a Pull Request, please ensure your code passes our quality checks:

1.  **Type Checking**

    ```bash
    bun run check
    ```

2.  **Formatting**

    ```bash
    bun run format
    ```

3.  **Linting**
    ```bash
    bun run lint
    ```

## 📐 Coding Standards

- **Svelte 5 Runes**: We use the new Runes API (`$state`, `$derived`, `$effect`, `$props`). Avoid legacy `export let` or `$:`.
- **Tailwind CSS v4**: Use utility classes for styling. Avoid inline styles.
- **Valibot**: Use Valibot for all data validation schemas.
- **Lucide Icons**: Use `@lucide/svelte` for icons.

## 📝 Pull Request Process

1.  Create a new branch for your feature or fix: `git checkout -b feature/amazing-feature`.
2.  Commit your changes with descriptive messages.
3.  Push to your fork and submit a Pull Request to the `main` branch.
4.  Ensure all checks pass.
5.  Wait for review! We aim to review PRs within 48 hours.

## 🐛 Reporting Bugs

Please use the [GitHub Issues](https://github.com/Michael-Obele/tif/issues) to report bugs. Include:

- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

Thank you for contributing!
