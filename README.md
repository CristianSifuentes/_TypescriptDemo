# TypeScript Demo

> A professional TypeScript project setup from scratch — covering initialization, compiler configuration, and best practices for modern Node.js development.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
  - [1. Initialize the Node.js Project](#1-initialize-the-nodejs-project)
  - [2. Install TypeScript](#2-install-typescript)
  - [3. Initialize the TypeScript Compiler](#3-initialize-the-typescript-compiler)
- [TypeScript Configuration (tsconfig.json)](#typescript-configuration-tsconfigjson)
  - [File Layout](#file-layout)
  - [Environment Settings](#environment-settings)
  - [Output Configuration](#output-configuration)
  - [Strict Type-Checking Options](#strict-type-checking-options)
  - [Style & Discipline Options](#style--discipline-options)
  - [Recommended Compiler Options](#recommended-compiler-options)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

**TypeScript** is a strongly typed superset of JavaScript developed and maintained by Microsoft. It compiles down to plain JavaScript and runs anywhere JavaScript runs — browsers, Node.js, and serverless environments.

This repository demonstrates how to bootstrap a TypeScript project from zero using the standard toolchain, and documents the rationale behind every compiler option in `tsconfig.json`.

Key goals:
- Clear, reproducible setup with three commands
- Fully annotated `tsconfig.json` with production-ready defaults
- Foundation for any Node.js / React / full-stack TypeScript project

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | >= 18.x LTS | JavaScript runtime |
| [npm](https://www.npmjs.com/) | >= 9.x | Package manager (bundled with Node.js) |

Verify your environment:

```bash
node --version   # v18.x or higher
npm --version    # 9.x or higher
```

---

## Project Setup

### 1. Initialize the Node.js Project

```bash
npm init -y
```

**What this does:**

- Scaffolds a `package.json` with sensible defaults, skipping all interactive prompts (`-y` = yes to all).
- Sets the project `name` from the directory name, `version` to `1.0.0`, and `license` to `ISC`.
- This file is the manifest for your project — it tracks metadata, scripts, and dependencies.

Generated `package.json` snapshot:

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "license": "ISC"
}
```

---

### 2. Install TypeScript

```bash
npm install typescript --save-dev
```

**What this does:**

- Downloads the `typescript` package from the npm registry and installs it under `node_modules/.bin/tsc`.
- `--save-dev` records it as a **development dependency** in `package.json` — TypeScript is a build-time tool, not a runtime dependency, so it must never appear in `dependencies`.
- Adds a `package-lock.json` to lock the exact resolved version for reproducible installs across teams and CI.

> **Why a dev dependency?** Production builds only ship the compiled `.js` output. Including TypeScript in `dependencies` would bloat deployment artifacts and slow container image builds.

After installation, verify the compiler is available locally:

```bash
npx tsc --version   # Version 6.x.x
```

---

### 3. Initialize the TypeScript Compiler

```bash
npx tsc --init
```

**What this does:**

- Generates a `tsconfig.json` file in the project root — the single source of truth for the TypeScript compiler (`tsc`).
- Includes every available compiler option as commented-out entries, making it easy to discover and enable options incrementally.
- `npx` runs the locally installed `tsc` binary without requiring a global TypeScript installation.

> **Best practice:** Always run `tsc` via `npx` or an npm script to ensure the project's pinned TypeScript version is used, not a global one that may differ across machines.

---

## TypeScript Configuration (tsconfig.json)

The `tsconfig.json` file controls every aspect of the TypeScript compilation pipeline. Below is the annotated configuration used in this project:

```jsonc
{
  "compilerOptions": {

    // ─── File Layout ──────────────────────────────────────────────────────────
    // "rootDir": "./src",
    // "outDir": "./dist",

    // ─── Environment Settings ─────────────────────────────────────────────────
    "module": "nodenext",
    "target": "esnext",
    "types": [],

    // ─── Other Outputs ────────────────────────────────────────────────────────
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // ─── Stricter Typechecking Options ────────────────────────────────────────
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // ─── Recommended Options ──────────────────────────────────────────────────
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

---

### File Layout

| Option | Value | Description |
|--------|-------|-------------|
| `rootDir` | `./src` | *(commented out)* Root folder for source `.ts` files. Enabling this enforces that all TypeScript lives under `src/` and prevents accidental compilation of files outside that directory. |
| `outDir` | `./dist` | *(commented out)* Output directory for compiled `.js`, `.d.ts`, and `.map` files. Separating source from output keeps the repo clean and allows `dist/` to be safely `.gitignore`d. |

> **Recommendation:** Uncomment both when the project grows beyond a single file. Add `dist/` to `.gitignore`.

---

### Environment Settings

| Option | Value | Description |
|--------|-------|-------------|
| `module` | `"nodenext"` | Uses Node.js native ESM/CJS interop resolution introduced in Node 12+. Enforces correct `.js` extensions in import paths and respects `"type"` in `package.json`. The most accurate module system for modern Node.js projects. |
| `target` | `"esnext"` | Compiles to the latest ECMAScript version without any downleveling. Appropriate when targeting modern Node.js (18+) or evergreen browsers where all ES2022+ features are natively supported. |
| `types` | `[]` | Disables automatic inclusion of `@types/*` packages from `node_modules`. Only type definitions explicitly listed here (or imported directly) are included. This prevents accidental type pollution from globally installed packages. |

> **Node.js types:** To enable Node.js built-in type definitions, change `types` to `["node"]` and install `@types/node`:
> ```bash
> npm install -D @types/node
> ```

---

### Output Configuration

| Option | Value | Description |
|--------|-------|-------------|
| `sourceMap` | `true` | Generates `.js.map` files that map compiled JavaScript back to the original TypeScript source. Essential for readable stack traces in debuggers, Node.js `--enable-source-maps`, and error monitoring tools like Sentry. |
| `declaration` | `true` | Emits `.d.ts` type declaration files alongside compiled output. Required when publishing a package to npm so consumers get full type-checking and IntelliSense without access to your source. |
| `declarationMap` | `true` | Generates `.d.ts.map` files that link declaration files back to source TypeScript. Enables "Go to Definition" in IDEs to jump to the actual `.ts` source rather than the generated `.d.ts` stub — invaluable during monorepo development. |

---

### Strict Type-Checking Options

These options go beyond the `strict` flag to catch additional categories of bugs.

| Option | Value | Description |
|--------|-------|-------------|
| `noUncheckedIndexedAccess` | `true` | Array and object index access (`arr[0]`, `obj[key]`) now returns `T \| undefined` instead of `T`. Forces you to handle the case where the index does not exist, eliminating an entire class of runtime `TypeError: Cannot read properties of undefined`. |
| `exactOptionalPropertyTypes` | `true` | Distinguishes between a property being absent (`{}`) and a property explicitly set to `undefined` (`{ foo: undefined }`). Without this, TypeScript treats them interchangeably, which can mask subtle bugs in serialization and API contracts. |

---

### Style & Discipline Options

These options enforce code quality and are available to enable as the project matures:

| Option | Default | Description |
|--------|---------|-------------|
| `noImplicitReturns` | `false` | Errors when a function has code paths that return a value and code paths that fall off the end without returning. Prevents accidentally returning `undefined` from non-void functions. |
| `noImplicitOverride` | `false` | Requires the `override` keyword on methods that override a parent class method. Makes inheritance chains explicit and prevents silent bugs when a base class method is renamed. |
| `noUnusedLocals` | `false` | Errors on declared local variables that are never read. Keeps code clean and catches variables left behind after refactoring. |
| `noUnusedParameters` | `false` | Errors on function parameters that are declared but never used. Useful in conjunction with `noUnusedLocals` for thorough dead-code elimination. |
| `noFallthroughCasesInSwitch` | `false` | Errors when a `switch` case falls through to the next case without a `break` or `return`. Prevents a very common class of logic bugs. |

---

### Recommended Compiler Options

These are the core options that every modern TypeScript project should enable from day one.

| Option | Value | Description |
|--------|-------|-------------|
| `strict` | `true` | Enables the full suite of strict type-checking flags: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, and `alwaysStrict`. The single most impactful option for type safety. |
| `jsx` | `"react-jsx"` | Configures JSX transform for React 17+ automatic runtime. Removes the need for `import React from 'react'` in every `.tsx` file. Use `"preserve"` for frameworks like Next.js that handle JSX transformation separately. |
| `verbatimModuleSyntax` | `true` | Enforces that `import type` is used for type-only imports and `export type` for type-only exports. Ensures imports are erased at compile time with no runtime cost and prevents bundler misclassification of type vs. value imports. |
| `isolatedModules` | `true` | Ensures every file can be independently transpiled by tools like `esbuild`, `swc`, or Babel without full type information. Required for compatibility with high-speed build tools. Enforces patterns (e.g., no `const enum`) that work with single-file transpilation. |
| `noUncheckedSideEffectImports` | `true` | Prevents importing modules purely for side effects (`import './setup'`) unless the module is explicitly typed. Adds safety around implicit global mutations from third-party packages. |
| `moduleDetection` | `"force"` | Forces TypeScript to treat every `.ts` file as a module (even files without imports/exports). Without this, files without `import`/`export` are treated as global scripts, causing unexpected namespace collisions. |
| `skipLibCheck` | `true` | Skips type-checking of all `.d.ts` declaration files in `node_modules`. Dramatically speeds up compilation and avoids errors caused by conflicting or malformed types in third-party packages — a problem you cannot fix yourself. |

---

## Project Structure

```
_TypescriptDemo/
├── src/                  # TypeScript source files (recommended)
│   └── index.ts
├── dist/                 # Compiled JavaScript output (git-ignored)
├── node_modules/         # npm dependencies (git-ignored)
├── .gitignore
├── LICENSE
├── package.json          # Project manifest and scripts
├── package-lock.json     # Locked dependency tree
├── tsconfig.json         # TypeScript compiler configuration
└── README.md
```

---

## Scripts

Add these to the `scripts` section of `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "rm -rf dist",
    "start": "node dist/index.js",
    "dev": "tsc --watch & node --watch dist/index.js"
  }
}
```

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `npm run build` | Runs the TypeScript compiler once and emits output to `dist/` |
| `build:watch` | `npm run build:watch` | Watches source files and recompiles on every change |
| `clean` | `npm run clean` | Removes the compiled output directory |
| `start` | `npm start` | Runs the compiled entry point |
| `dev` | `npm run dev` | Compiles in watch mode and restarts Node on output changes |

---

## License

This project is licensed under the **ISC License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with TypeScript · Node.js · npm

</div>
