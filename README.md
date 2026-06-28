# TypeScript Demo

> A professional TypeScript project setup from scratch — covering initialization, compiler configuration, compilation, and execution best practices for modern Node.js development.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
  - [1. Initialize the Node.js Project](#1-initialize-the-nodejs-project)
  - [2. Install TypeScript](#2-install-typescript)
  - [3. Initialize the TypeScript Compiler](#3-initialize-the-typescript-compiler)
  - [4. Compile TypeScript to JavaScript](#4-compile-typescript-to-javascript)
  - [5. Run the Compiled Output](#5-run-the-compiled-output)
- [Compilation & Execution Workflow](#compilation--execution-workflow)
- [TypeScript Configuration (tsconfig.json)](#typescript-configuration-tsconfigjson)
  - [File Layout](#file-layout)
  - [Environment Settings](#environment-settings)
  - [Output Configuration](#output-configuration)
  - [Strict Type-Checking Options](#strict-type-checking-options)
  - [Style & Discipline Options](#style--discipline-options)
  - [Recommended Compiler Options](#recommended-compiler-options)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Minification & Uglification](#minification--uglification)
  - [What is Uglification?](#what-is-uglification)
  - [1. uglify-js via CLI](#1-uglify-js-via-cli)
  - [2. Web-Based Tools](#2-web-based-tools)
  - [3. Terser — Modern Alternative](#3-terser--modern-alternative)
  - [TypeScript + Minification Pipeline](#typescript--minification-pipeline)
  - [Key Benefits](#key-benefits)
- [Tree Shaking](#tree-shaking)
  - [What is Tree Shaking?](#what-is-tree-shaking)
  - [How Angular Tree Shaking Works](#how-angular-tree-shaking-works)
  - [Ensuring Tree Shaking is Active](#ensuring-tree-shaking-is-active)
  - [angular.json Production Configuration](#angularjson-production-configuration)
  - [Import Discipline](#import-discipline)
  - [Tree Shaking Pipeline](#tree-shaking-pipeline)
  - [Tool Comparison](#tool-comparison-1)
- [Compiler vs Transpiler](#compiler-vs-transpiler)
  - [What is a Compiler?](#what-is-a-compiler)
  - [What is a Transpiler?](#what-is-a-transpiler)
  - [Quick Comparison](#quick-comparison)
  - [Is TypeScript tsc a Compiler or a Transpiler?](#is-typescript-tsc-a-compiler-or-a-transpiler)
  - [How the TypeScript Pipeline Works](#how-the-typescript-pipeline-works)
  - [Alternative Build Tools](#alternative-build-tools)
- [Elvis Operator in TypeScript](#elvis-operator-in-typescript)
  - [Optional Chaining (?.)](#optional-chaining-)
  - [Nullish Coalescing (??)](#nullish-coalescing-)
  - [Combining Both — The True Elvis Alternative](#combining-both--the-true-elvis-alternative)
  - [Why Not Use Logical OR (||)?](#why-not-use-logical-or-)
  - [Nullish Coalescing Assignment (??=)](#nullish-coalescing-assignment-)
  - [Operator Quick Reference](#operator-quick-reference)
- [License](#license)

---

## Overview

**TypeScript** is a strongly typed superset of JavaScript developed and maintained by Microsoft. It compiles down to plain JavaScript and runs anywhere JavaScript runs — browsers, Node.js, and serverless environments.

This repository demonstrates how to bootstrap a TypeScript project from zero using the standard toolchain, and documents the rationale behind every compiler option in `tsconfig.json`.

Key goals:
- Clear, reproducible setup with five commands — from `npm init` to a running Node.js process
- Fully annotated `tsconfig.json` with production-ready defaults
- End-to-end compilation and execution workflow explained in depth
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

### 4. Compile TypeScript to JavaScript

```bash
npx tsc
```

**What this does:**

- Invokes the TypeScript compiler using the settings defined in `tsconfig.json` — no extra flags required.
- Reads all `.ts` source files starting from `rootDir` (or the project root if not set), type-checks them, and emits compiled artifacts to `outDir` (e.g., `dist/`).
- Generates three output files per source file when `sourceMap`, `declaration`, and `declarationMap` are all enabled:

  | Input | Output | Purpose |
  |-------|--------|---------|
  | `src/main.ts` | `dist/main.js` | Runnable JavaScript |
  | `src/main.ts` | `dist/main.js.map` | Source map for debuggers |
  | `src/main.ts` | `dist/main.d.ts` | Type declaration file |
  | `src/main.ts` | `dist/main.d.ts.map` | Declaration source map |

- If any type error is found, compilation **fails with a non-zero exit code** and no output is emitted. This makes `npx tsc` safe to use as a CI gate.

**Common flags:**

```bash
npx tsc --noEmit          # Type-check only — do not write any output files
npx tsc --watch           # Watch mode — recompile automatically on file save
npx tsc --listFiles       # Print every file included in compilation
npx tsc --diagnostics     # Show timing and memory usage per compilation phase
npx tsc --project ./tsconfig.prod.json   # Use an alternate tsconfig
```

> **CI tip:** Run `npx tsc --noEmit` in your pipeline to enforce type safety without producing build artifacts that might be accidentally deployed from a CI runner.

---

### 5. Run the Compiled Output

```bash
node dist/main.js
```

**What this does:**

- Executes the compiled JavaScript entry point directly with the Node.js runtime — no TypeScript involved at this stage.
- `dist/` is the output directory configured in `tsconfig.json` via `"outDir"`. The file name mirrors your source entry point (`src/main.ts` → `dist/main.js`).
- Node.js reads plain `.js` — TypeScript types, interfaces, and decorators are fully erased during compilation and add zero runtime overhead.

**With source map support:**

```bash
node --enable-source-maps dist/main.js
```

When `"sourceMap": true` is set in `tsconfig.json`, the `--enable-source-maps` flag tells Node.js to translate compiled `.js` line numbers back to the original `.ts` source in stack traces. This is essential for debugging production errors.

**Example stack trace comparison:**

Without source maps:
```
TypeError: Cannot read properties of undefined
    at dist/main.js:14:32
```

With `--enable-source-maps`:
```
TypeError: Cannot read properties of undefined
    at greet (src/main.ts:8:12)
```

**Passing arguments and environment variables:**

```bash
# Pass environment variables inline
NODE_ENV=production node dist/main.js

# Pass CLI arguments (accessible via process.argv)
node dist/main.js --port 3000 --verbose

# Enable source maps and pass args together
node --enable-source-maps dist/main.js --port 3000
```

> **Convention:** The entry file is named `main.ts` (compiled to `dist/main.js`) by convention for executables, and `index.ts` (compiled to `dist/index.js`) for libraries meant to be imported by other packages.

---

## Compilation & Execution Workflow

The full end-to-end flow from source to running process:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       TypeScript Build Pipeline                         │
│                                                                         │
│   src/main.ts                                                           │
│       │                                                                 │
│       │  npx tsc  (reads tsconfig.json)                                 │
│       │                                                                 │
│       ├──► dist/main.js          ◄── runnable JavaScript               │
│       ├──► dist/main.js.map      ◄── source map (debugger / Node.js)   │
│       ├──► dist/main.d.ts        ◄── type declarations (npm consumers) │
│       └──► dist/main.d.ts.map    ◄── declaration source map (IDEs)     │
│                                                                         │
│   node dist/main.js                                                     │
│       │                                                                 │
│       └──► process runs with zero TypeScript overhead                  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Command sequence — from zero to running:**

```bash
npm init -y                          # 1. Create package.json
npm install typescript --save-dev    # 2. Install TypeScript compiler
npx tsc --init                       # 3. Generate tsconfig.json
npx tsc                              # 4. Compile src/ → dist/
node dist/main.js                    # 5. Execute compiled output
```

**Exit codes:**

| Exit Code | Meaning |
|-----------|---------|
| `0` | Compilation succeeded / process exited cleanly |
| `1` | TypeScript type errors found — no output emitted |
| `2` | Invalid compiler options or malformed `tsconfig.json` |

**Watch mode for development:**

```bash
# Terminal 1 — recompile on save
npx tsc --watch

# Terminal 2 — restart on new output
node --watch dist/main.js
```

> Node.js `--watch` (available since v18.11) restarts the process whenever watched files change, removing the need for external tools like `nodemon` for basic development loops.

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
├── src/                  # TypeScript source files
│   └── main.ts           # Entry point → compiled to dist/main.js
├── dist/                 # Compiled output — git-ignored, generated by npx tsc
│   ├── main.js           # Runnable JavaScript  →  node dist/main.js
│   ├── main.js.map       # Source map (debuggers, --enable-source-maps)
│   ├── main.d.ts         # Type declarations (npm consumers / IDEs)
│   └── main.d.ts.map     # Declaration source map (Go-to-Definition)
├── node_modules/         # npm dependencies — git-ignored
├── .gitignore
├── LICENSE
├── package.json          # Project manifest and npm scripts
├── package-lock.json     # Locked dependency tree (commit this)
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
    "build:check": "tsc --noEmit",
    "build:watch": "tsc --watch",
    "clean": "rm -rf dist",
    "start": "node --enable-source-maps dist/main.js",
    "dev": "tsc --watch & node --watch --enable-source-maps dist/main.js"
  }
}
```

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `npm run build` | Runs `npx tsc` — compiles all TypeScript source files to `dist/` |
| `build:check` | `npm run build:check` | Type-checks with `tsc --noEmit` — no output emitted, safe for CI |
| `build:watch` | `npm run build:watch` | Watches source files and recompiles on every save |
| `clean` | `npm run clean` | Removes the `dist/` output directory entirely |
| `start` | `npm start` | Runs `node dist/main.js` with source maps enabled for readable stack traces |
| `dev` | `npm run dev` | Compiles in watch mode and auto-restarts Node.js via `--watch` on new output |

---

## Minification & Uglification

### What is Uglification?

**Uglifying JavaScript** is the process of minifying your source code by removing every character that is meaningful to humans but irrelevant to the JavaScript engine — whitespace, newlines, and comments — while also renaming variables and function identifiers to the shortest possible names (typically single letters).

The result is semantically identical code that:

- Loads and parses faster due to dramatically reduced file size
- Transfers more efficiently over HTTP/2 and HTTP/3
- Provides a degree of light obfuscation, making logical structures harder to reverse-engineer at a glance

> **TypeScript context:** You always minify the **compiled `.js` output** in `dist/`, never the `.ts` source. The TypeScript compilation step (`npx tsc`) happens first; minification is the final step before deployment.

---

### 1. uglify-js via CLI

`uglify-js` is the classic, battle-tested industry tool for JavaScript minification, available as an npm package.

**Install globally:**

```bash
npm install uglify-js -g
```

**Basic minification** — removes whitespace, comments, and newlines:

```bash
uglifyjs dist/main.js -o dist/main.min.js
```

**Full optimization** — minification + name mangling + compression (recommended):

```bash
uglifyjs dist/main.js -m -c -o dist/main.min.js
```

| Flag | Full Name | Effect |
|------|-----------|--------|
| `-o` | `--output` | Specifies the output file path |
| `-m` | `--mangle` | Renames variables and functions to single-letter identifiers — the biggest size reduction after whitespace removal |
| `-c` | `--compress` | Applies code transformations: dead-code elimination, constant folding, `if`→ternary rewrites, and more |

**Inspect what changed:**

```bash
# Compare original vs minified size
wc -c dist/main.js dist/main.min.js

# Pretty-print the minified output to audit it
uglifyjs dist/main.min.js --beautify -o dist/main.readable.js
```

> **Limitation:** `uglify-js` was built for ES5. If your `tsconfig.json` targets `"esnext"` or `"es2020+"`, the compiled output may include arrow functions, `class` syntax, optional chaining, or nullish coalescing — all of which can cause `uglify-js` to throw parse errors. Use **Terser** instead (see below).

---

### 2. Web-Based Tools

For quick, one-off compressions or visual inspection without installing anything:

| Tool | URL | Notes |
|------|-----|-------|
| UglifyJS 3 Online Minifier | `skalman.github.io/UglifyJS-online` | Wraps the official `uglify-js` v3 in a browser UI |
| JS Minify and Beautify | `javascript-minifier.com` | Supports minify and reverse beautify in one page |
| Terser REPL | `try.terser.org` | Interactive Terser playground with full option control |

> Web tools are suitable for inspecting output or compressing one-off scripts. For reproducible, automated builds always use a local CLI tool or bundler plugin.

---

### 3. Terser — Modern Alternative

**Terser** is a community fork of `uglify-js` that fully supports modern ECMAScript (ES6+) syntax. It is the de facto standard minifier used internally by Webpack, Vite, esbuild, and Rollup.

**Run without installing** (via `npx`):

```bash
npx terser dist/main.js --mangle --compress --output dist/main.min.js
```

**With source map support** (highly recommended for production debugging):

```bash
npx terser dist/main.js \
  --mangle \
  --compress \
  --source-map "content='dist/main.js.map',url='main.min.js.map'" \
  --output dist/main.min.js
```

**Install as a dev dependency** (preferred for reproducible builds):

```bash
npm install terser --save-dev
```

Then add to `package.json` scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "minify": "terser dist/main.js --mangle --compress --output dist/main.min.js",
    "build:prod": "npm run build && npm run minify"
  }
}
```

**Key Terser flags:**

| Flag | Description |
|------|-------------|
| `--mangle` | Renames local variables and functions to shortest possible names |
| `--compress` | Enables the optimizer: dead-code elimination, constant folding, inlining |
| `--output` | Path of the minified output file |
| `--source-map` | Generates a `.map` file referencing the original compiled output |
| `--module` | Enables ES module mode (required when source uses `import`/`export`) |
| `--ecma 2020` | Sets the target ECMAScript version for syntax-level optimizations |

---

### TypeScript + Minification Pipeline

The complete production build flow with TypeScript and Terser:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TypeScript → Production Pipeline                        │
│                                                                             │
│   src/main.ts                                                               │
│       │                                                                     │
│       │  Step 1: npx tsc                                                   │
│       │                                                                     │
│       ├──► dist/main.js          ◄── full compiled JS (readable)           │
│       └──► dist/main.js.map      ◄── source map                            │
│                │                                                            │
│                │  Step 2: npx terser dist/main.js --mangle --compress      │
│                │                                                            │
│                ├──► dist/main.min.js      ◄── minified, deployment-ready   │
│                └──► dist/main.min.js.map  ◄── source map chain             │
│                                                                             │
│   node dist/main.min.js                                                    │
│       └──► smallest possible runtime footprint                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Two-step production build command:**

```bash
npx tsc && npx terser dist/main.js --mangle --compress --output dist/main.min.js
```

**Tool comparison:**

| Tool | ES6+ Support | Source Maps | Tree Shaking | Best For |
|------|-------------|-------------|--------------|----------|
| `uglify-js` | No (ES5 only) | Yes | No | Legacy ES5 codebases |
| `terser` | Yes (ES2020+) | Yes | No | Modern Node.js / standalone scripts |
| Webpack + TerserPlugin | Yes | Yes | Yes | Application bundles |
| Vite / Rollup | Yes | Yes | Yes | Frontend / library builds |

> **For this project:** `terser` is the recommended choice since `tsconfig.json` targets `"esnext"` and outputs modern JavaScript that `uglify-js` cannot safely parse.

---

### Key Benefits

| Benefit | Detail |
|---------|--------|
| **File size reduction** | Minification + mangling routinely achieves **50–70% size reduction** on real-world JavaScript files |
| **Faster HTTP transfers** | Smaller assets mean fewer bytes transferred over the wire — critical on mobile networks and for Core Web Vitals scores |
| **Faster parse time** | The JavaScript engine spends less time lexing and parsing a compact file |
| **Light obfuscation** | Mangled identifiers (`a`, `b`, `c`) make logical structures significantly harder to reverse-engineer without source maps |
| **Lower memory pressure** | Smaller scripts occupy less memory in the V8 heap during initial parse |

> **Security note:** Minification is **not** a substitute for real obfuscation or access control. Anyone with browser DevTools and a source map can restore the original structure. Do not rely on it to protect sensitive business logic — keep that server-side.

---

## Tree Shaking

### What is Tree Shaking?

**Tree shaking** is a dead-code elimination technique applied during the production build process. The term comes from the mental model of shaking a dependency tree: modules and functions that nothing references fall out of the bundle, while only the code that is actually reachable from your application's entry point is kept.

In the context of **Angular + TypeScript**, tree shaking is not a single feature — it is the combined result of three interlocking mechanisms:

| Mechanism | Role |
|-----------|------|
| **ES Modules (`import`/`export`)** | Static, analyzable import graph — no dynamic `require()` that would prevent static analysis |
| **Ahead-of-Time (AOT) Compilation** | Templates compiled at build time, making component dependencies statically known |
| **Angular Ivy** | Generates granular, per-feature instructions that are individually tree-shakeable |

> **Why it matters:** A freshly scaffolded Angular application ships the entire `@angular/core`, `@angular/common`, and `@angular/forms` packages unless tree shaking removes the portions your app never touches. In large applications this can represent megabytes of unused code.

---

### How Angular Tree Shaking Works

**1. Dead Code Elimination via the Import Graph**

Angular's build tool (powered by esbuild or Webpack) traverses every `import` statement starting from `main.ts`. If a symbol is imported but its exported value is never referenced in any reachable code path, it is marked dead and excluded from the final bundle.

```typescript
// BAD — imports the entire library; tree shaking may miss unused parts
import * as _ from 'lodash';

// GOOD — imports only what is used; everything else is pruned
import { debounce } from 'lodash-es';
```

**2. Ahead-of-Time (AOT) Compilation**

During `ng build --configuration production`, Angular compiles your component templates from HTML to TypeScript factory functions at build time (not in the browser at runtime). This converts template bindings into static JavaScript references, making all template dependencies visible to the bundler's static analyzer — and therefore eligible for elimination if unused.

```
Template compilation (AOT)
  ├─ <app-button> → references ButtonComponent class → kept
  ├─ <mat-icon>   → references MatIconModule → kept
  └─ <mat-table>  → never used in templates → eliminated
```

**3. Angular Ivy — Granular Tree-Shakeable Instructions**

The **Ivy rendering engine** (default since Angular 9) generates locality-based, instruction-level code. Each framework feature — animations, internationalization, reactive forms, common directives — is compiled into a discrete instruction set. If a component's template never invokes an animation, the entire animation engine is absent from the final bundle.

```typescript
// Component never uses animations → AnimationModule is tree-shaken out
@Component({
  template: `<p>Hello</p>`  // no [@trigger] bindings
})
export class SimpleComponent {}
```

---

### Ensuring Tree Shaking is Active

Tree shaking is **not active during `ng serve`** (development mode). It only runs as part of a production build. Attempting to measure bundle size on a dev server output will give misleading numbers.

| Command | Tree Shaking | AOT | Minification | Use Case |
|---------|-------------|-----|--------------|----------|
| `ng serve` | No | No | No | Local development |
| `ng build` | Partial | Yes | No | Staging / QA |
| `ng build --configuration production` | Yes | Yes | Yes | Production deployment |

**Always use the production configuration for size measurements and deployments:**

```bash
ng build --configuration production
```

**Analyze the output bundle after building:**

```bash
# Install the bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Build with stats output
ng build --configuration production --stats-json

# Launch visual report
npx webpack-bundle-analyzer dist/<your-app>/stats.json
```

---

### angular.json Production Configuration

In `angular.json`, verify that your production configuration has both `optimization` and `buildOptimizer` enabled. These are the flags that activate tree shaking, Terser minification, and Angular's additional dead-code passes:

```json
{
  "configurations": {
    "production": {
      "optimization": true,
      "buildOptimizer": true,
      "aot": true,
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false
    }
  }
}
```

| Property | Value | Effect |
|----------|-------|--------|
| `optimization` | `true` | Enables Terser minification, scope hoisting, and dead-code removal |
| `buildOptimizer` | `true` | Applies Angular-specific optimizations: removes decorator metadata, simplifies component factories |
| `aot` | `true` | Compiles templates at build time — required for full tree shaking |
| `sourceMap` | `false` | Omits source maps from the production bundle (enable if using remote error monitoring) |
| `namedChunks` | `false` | Uses content hashes for chunk filenames instead of readable names — improves long-term caching |
| `extractLicenses` | `true` | Extracts third-party license headers into a separate `3rdpartylicenses.txt` file |
| `vendorChunk` | `false` | Merges vendor code into the main chunk — reduces HTTP requests when HTTP/2 is available |

---

### Import Discipline

How you write `import` statements is the single biggest factor you control over tree-shaking effectiveness.

**Avoid barrel imports from large libraries:**

```typescript
// BAD — forces the entire @angular/material bundle into scope
import { MatButtonModule, MatIconModule, MatTableModule } from '@angular/material';

// GOOD — each module is a discrete chunk; only imported ones are included
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
```

**Avoid side-effect imports unless necessary:**

```typescript
// BAD — prevents tree shaking of the entire module
import 'rxjs/add/operator/map';

// GOOD — pipeable operators are individually tree-shakeable
import { map } from 'rxjs/operators';
```

**Use `import type` for type-only references (enforced by `verbatimModuleSyntax: true`):**

```typescript
// Type import — fully erased at compile time, zero bundle impact
import type { User } from './models/user';

// Value import — included in the bundle if the symbol is used at runtime
import { UserService } from './services/user.service';
```

---

### Tree Shaking Pipeline

End-to-end flow showing where tree shaking fits in the Angular production build:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│               Angular Production Build Pipeline (ng build --prod)           │
│                                                                              │
│   src/main.ts                                                                │
│       │                                                                      │
│       │  Step 1: AOT Compiler (ngc)                                         │
│       │  Templates → TypeScript factory functions                            │
│       │  All dependencies become statically visible                          │
│       │                                                                      │
│       │  Step 2: esbuild / Webpack — Module Bundling                        │
│       │  Traverses import graph from main.ts                                 │
│       │  Marks every unreachable export as dead code                         │
│       │                                                                      │
│       │  Step 3: Terser — Minification + Tree Shaking                       │
│       │  Eliminates dead code, mangles identifiers, compresses output        │
│       │                                                                      │
│       └──► dist/<app>/                                                       │
│               ├── main.<hash>.js      ◄── app code, tree-shaken + minified  │
│               ├── polyfills.<hash>.js ◄── browser compatibility shims       │
│               ├── runtime.<hash>.js   ◄── webpack/esbuild bootstrap         │
│               └── styles.<hash>.css   ◄── extracted and purged CSS          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### Tool Comparison

| Tool | Tree Shaking | TypeScript | Angular Support | Notes |
|------|-------------|------------|-----------------|-------|
| **esbuild** (Angular 17+) | Yes | Yes | Native | Fastest build tool available; default in Angular 17+ |
| **Webpack** (Angular <17) | Yes | Yes | Native | Mature ecosystem; slower than esbuild |
| **Rollup** | Yes | Via plugin | Manual | Best for library builds, not Angular apps |
| **Vite** | Yes | Yes | Via plugin | Popular for standalone TypeScript projects |
| **Terser** | Partial | Post-compile | Via bundler | Minifier only — handles dead-code within a single file |
| **uglify-js** | No | No | No | ES5 only; cannot parse modern Angular output |

> **Angular 17+ note:** The default builder switched from `@angular-devkit/build-angular:browser` (Webpack) to `@angular-devkit/build-angular:application` (esbuild). esbuild performs tree shaking natively and is 10–100× faster than Webpack for large projects.

---

## Compiler vs Transpiler

Understanding what `tsc` actually does under the hood — and how it differs from a traditional compiler — is foundational to working confidently with TypeScript toolchains.

---

### What is a Compiler?

A **compiler** is any tool that translates source code written in one language into another language. In the traditional sense, this means transforming a high-level human-readable language into low-level machine code or bytecode that a processor or virtual machine can execute directly.

**Examples of traditional compilers:**

| Source Language | Output | Executed By |
|----------------|--------|-------------|
| C / C++ | Native machine code (binary) | CPU directly |
| Java | JVM bytecode (`.class` files) | Java Virtual Machine |
| C# | CIL bytecode (`.dll` / `.exe`) | .NET CLR |
| Rust | Native machine code | CPU directly |

The defining characteristic is the **dramatic drop in abstraction level** — from human-readable source to something the machine can natively execute without further translation.

---

### What is a Transpiler?

A **transpiler** (short for *source-to-source compiler*) is a specific subtype of compiler that translates code between two languages that operate at a **similar level of abstraction**. The output remains human-readable source code rather than bytecode or binary.

**Examples of transpilers:**

| Source Language | Output Language | Tool |
|----------------|----------------|------|
| TypeScript | JavaScript | `tsc` |
| Modern JS (ES2022+) | Legacy JS (ES5) | Babel |
| Sass / SCSS | CSS | `sass` compiler |
| CoffeeScript | JavaScript | `coffee` |
| JSX | JavaScript | Babel / esbuild |

The defining characteristic is that **abstraction level is preserved** — a developer could read and understand the output without specialized knowledge of assembly or bytecode formats.

---

### Quick Comparison

| Feature | Compiler (Traditional) | Transpiler (Source-to-Source) |
|---------|----------------------|-------------------------------|
| **Output target** | Machine code, assembly, or bytecode | Another high-level source language |
| **Abstraction level** | Drops drastically | Remains at a similar level |
| **Human readability** | Output is binary or unreadable | Output is readable source code |
| **Debuggability** | Requires debug symbols / DWARF | Output is directly readable; source maps optional |
| **Runtime required** | None (native) or VM (JVM/.NET) | Host language runtime (Node.js, browser) |
| **TypeScript context** | The tool is officially named *TypeScript Compiler* (`tsc`) | Its emit phase strips types → produces JS (transpilation) |

---

### Is TypeScript tsc a Compiler or a Transpiler?

**It is both** — and the distinction depends on which phase of `tsc`'s pipeline you are describing.

Microsoft officially named the tool the **TypeScript Compiler (`tsc`)** because it performs the full set of operations associated with a traditional compiler:

- **Lexical analysis** — tokenizes raw `.ts` source text
- **Parsing** — builds an Abstract Syntax Tree (AST)
- **Semantic analysis** — resolves symbols, checks types across files, catches errors

These phases are identical in complexity to a traditional compiler front-end. However, the **emit phase** — the final output step — simply strips type annotations and generates plain JavaScript. The output is human-readable, at the same abstraction level as the input, and requires a JavaScript runtime to execute.

This makes `tsc` structurally a **transpiler** at the emit stage, even though it performs the analysis work of a full compiler.

> **Practical takeaway:** When someone says "TypeScript compiles to JavaScript," both terms are technically correct. "Transpiles" is more precise about the nature of the output; "compiles" is accurate about the depth of analysis performed.

---

### How the TypeScript Pipeline Works

`tsc` processes source files in three sequential phases:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TypeScript Compiler Pipeline                         │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │   Phase 1    │    │   Phase 2    │    │   Phase 3    │    │  Output  │  │
│  │   Parsing    │───►│Type Checking │───►│   Emitting   │───►│  dist/   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────┘  │
│                                                                             │
│  src/main.ts                                                                │
│      │                                                                      │
│      │  PHASE 1 — Parsing                                                  │
│      │  Lexer tokenizes raw text → Parser builds Abstract Syntax Tree      │
│      │  Every identifier, type annotation, and expression becomes a node   │
│      │                                                                      │
│      │  PHASE 2 — Type Checking                                            │
│      │  Symbol resolver binds names across files                           │
│      │  Type checker validates assignments, function signatures, generics  │
│      │  Errors reported here — no output emitted on failure                │
│      │                                                                      │
│      │  PHASE 3 — Emitting (Transpilation)                                 │
│      │  Type annotations, interfaces, and enums are erased                 │
│      │  Remaining AST is serialized back to JavaScript source              │
│      │                                                                      │
│      └──► dist/main.js        ◄── human-readable JavaScript               │
│           dist/main.js.map    ◄── source map (AST position mapping)       │
│           dist/main.d.ts      ◄── re-exported type declarations           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**What gets erased in Phase 3:**

```typescript
// TypeScript source (src/main.ts)
interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return `Hello, ${user.name}`;
}

const u: User = { id: 1, name: "Alice" };
console.log(greet(u));
```

```javascript
// Compiled output (dist/main.js) — types fully erased
function greet(user) {
  return `Hello, ${user.name}`;
}

const u = { id: 1, name: "Alice" };
console.log(greet(u));
```

Everything erased by the emit phase:

| Erased construct | Example |
|-----------------|---------|
| `interface` declarations | `interface User { ... }` |
| `type` aliases | `type ID = string \| number` |
| Type annotations | `: string`, `: User`, `: Promise<void>` |
| Generic type parameters | `<T>`, `Array<string>` |
| `enum` (const enum) | `const enum Direction { Up, Down }` |
| Access modifiers | `private`, `protected`, `readonly` |
| Non-null assertions | `value!.property` |
| `as` casts | `value as string` |

> **Zero runtime overhead:** Because all type information is erased before execution, TypeScript's type system adds **no performance cost at runtime**. The running JavaScript is identical to what a developer would have written by hand — just with more confidence in its correctness.

---

### Alternative Build Tools

`tsc` is not the only tool that can process TypeScript. Faster alternatives take a different approach: they **skip type checking entirely** during the build, treating type annotations as comments to be stripped rather than semantics to be verified. This makes them 10–100× faster, at the cost of requiring a separate type-check step.

| Tool | Approach | Type Checking | Speed | Best For |
|------|----------|--------------|-------|----------|
| `tsc` | Full compiler + transpiler | Yes (full) | Baseline | Projects where type safety is the priority |
| **Babel** (`@babel/preset-typescript`) | Strips types, transpiles JS | No | ~10× faster | Projects already using Babel for JS transforms |
| **SWC** (`@swc/core`) | Rust-based type stripper | No | ~70× faster | Large codebases, CI pipelines, Next.js |
| **esbuild** | Go-based bundler + stripper | No | ~100× faster | Bundling, Angular 17+, Vite internals |
| **Oxc** | Rust-based, Babel-compatible | No | ~200× faster | Emerging — Vite 6+ experimental |

**Recommended workflow for large projects:**

```bash
# Fast build (no type checking) — use during development
npx swc src -d dist

# Type checking only — run in CI or pre-commit
npx tsc --noEmit

# Full production build — type check then bundle
npx tsc --noEmit && npx esbuild src/main.ts --bundle --outfile=dist/main.js
```

> **Key insight:** Babel, SWC, and esbuild are pure **transpilers** — they perform no semantic analysis. `tsc` is a **compiler that also transpiles**. In practice, most production pipelines use a fast transpiler for builds and `tsc --noEmit` as a separate type-safety gate in CI.

---

## Elvis Operator in TypeScript

### What is the Elvis Operator?

The **Elvis operator** (`?:`) is a shorthand used in languages like Kotlin, Groovy, and PHP to safely navigate a value and return a fallback if it is `null` or `undefined`. The name comes from the `?:` symbol resembling Elvis Presley's hair and eyes when rotated sideways.

```kotlin
// Kotlin — the original Elvis operator
val city = user?.address?.city ?: "Unknown City"
```

**TypeScript does not have a `?:` Elvis operator.** Instead, it provides two purpose-built operators that together cover every use case the Elvis operator handles — with greater precision and no ambiguity around falsy values.

| Elvis Use Case | TypeScript Equivalent | Operator |
|---------------|----------------------|----------|
| Safe property navigation | Optional Chaining | `?.` |
| Fallback default value | Nullish Coalescing | `??` |
| Both combined | Chain both operators | `?. ` + `??` |
| Assign default if null/undefined | Nullish Assignment | `??=` |

---

### Optional Chaining (?.)

**Optional chaining** safely traverses a chain of property accesses, method calls, or array index lookups. If any value in the chain is `null` or `undefined`, the entire expression short-circuits and returns `undefined` — instead of throwing a `TypeError`.

```typescript
// Without optional chaining — throws if user or address is null
const zipCode = user.address.zipCode; // TypeError: Cannot read properties of null

// With optional chaining — returns undefined safely
const zipCode = user?.address?.zipCode;
```

**Works with method calls:**

```typescript
// Calls .toUpperCase() only if name is not null/undefined
const upper = user?.name?.toUpperCase();

// Calls the method only if the method itself exists on the object
const result = obj?.compute?.();
```

**Works with array index access:**

```typescript
const firstTag = article?.tags?.[0];
```

**Works with dynamic property access:**

```typescript
const value = config?.['feature-flags']?.['dark-mode'];
```

> **TypeScript + strict mode:** With `"noUncheckedIndexedAccess": true` (enabled in this project's `tsconfig.json`), array access already returns `T | undefined`. Combining it with `?.` ensures the entire chain is safely typed end-to-end.

---

### Nullish Coalescing (??)

**Nullish coalescing** returns the right-hand operand when the left-hand operand is strictly `null` or `undefined`. It is the precise replacement for using `||` as a fallback — without the footgun of triggering on all falsy values.

```typescript
const name = inputName ?? "Anonymous";
// Returns "Anonymous" only when inputName is null or undefined
// Returns inputName as-is for "", 0, false, or NaN
```

**Nested fallback chain:**

```typescript
const displayName = user.nickname ?? user.username ?? user.email ?? "Guest";
```

**With function calls:**

```typescript
const timeout = getConfig()?.timeout ?? 3000;
```

---

### Combining Both — The True Elvis Alternative

To fully replicate the Elvis operator — navigate a chain safely **and** provide a default if anything in the chain is missing — compose `?.` and `??` together:

```typescript
// Kotlin Elvis equivalent
// val city = user?.address?.city ?: "Unknown City"

// TypeScript equivalent
const city = user?.address?.city ?? "Unknown City";
```

**Real-world examples:**

```typescript
interface User {
  profile?: {
    address?: {
      city?: string;
      zipCode?: string;
    };
    displayName?: string;
  };
  settings?: {
    theme?: 'light' | 'dark';
    language?: string;
  };
}

const city        = user?.profile?.address?.city        ?? "Unknown City";
const displayName = user?.profile?.displayName          ?? "Anonymous";
const theme       = user?.settings?.theme               ?? "light";
const language    = user?.settings?.language            ?? navigator.language ?? "en";
```

**With method calls and fallback:**

```typescript
const formatted = user?.profile?.displayName?.trim() ?? "Guest";
```

---

### Why Not Use Logical OR (||)?

Before `??` was introduced (TypeScript 3.7 / ES2020), developers used `||` as a makeshift Elvis fallback. This is still common in legacy codebases, but it carries a significant semantic flaw: `||` activates on **all falsy values** — not just `null` and `undefined`.

```typescript
const count = 0;
const label = "";
const active = false;

// Using || — WRONG for these cases
const result1 = count  || 10;      // ❌  Returns 10  (0 is falsy)
const result2 = label  || "N/A";   // ❌  Returns "N/A" ("" is falsy)
const result3 = active || true;    // ❌  Returns true  (false is falsy)

// Using ?? — CORRECT
const result4 = count  ?? 10;      // ✅  Returns 0   (0 is not null/undefined)
const result5 = label  ?? "N/A";   // ✅  Returns ""  ("" is not null/undefined)
const result6 = active ?? true;    // ✅  Returns false (false is not null/undefined)
```

**Rule of thumb:**

| Operator | Triggers on | Use when |
|----------|------------|----------|
| `\|\|` | Any falsy value (`0`, `""`, `false`, `null`, `undefined`, `NaN`) | You want a fallback for all falsy values (rare) |
| `??` | Only `null` or `undefined` | You want a fallback specifically for missing values (almost always) |

---

### Nullish Coalescing Assignment (??=)

The **nullish coalescing assignment** operator (`??=`) assigns a value to a variable only when that variable is currently `null` or `undefined`. It is shorthand for the common pattern of checking and then assigning a default.

```typescript
// Verbose form
if (settings.theme === null || settings.theme === undefined) {
  settings.theme = "dark";
}

// Equivalent shorthand
settings.theme ??= "dark";
```

**Practical use cases:**

```typescript
// Initialize optional config properties with defaults
function applyDefaults(config: Partial<AppConfig>): AppConfig {
  config.theme    ??= "light";
  config.language ??= "en";
  config.timeout  ??= 5000;
  config.retries  ??= 3;
  return config as AppConfig;
}

// Lazy initialization of a cached value
class DataService {
  private _cache: Map<string, unknown> | null = null;

  get cache() {
    this._cache ??= new Map();
    return this._cache;
  }
}
```

**Related assignment operators for completeness:**

```typescript
a ||= b;   // Assign b if a is falsy     (logical OR assignment)
a &&= b;   // Assign b if a is truthy    (logical AND assignment)
a ??= b;   // Assign b if a is nullish   (nullish coalescing assignment)
```

---

### Operator Quick Reference

| Operator | Name | Returns | Short-circuits on |
|----------|------|---------|-------------------|
| `a?.b` | Optional chaining | `a.b` or `undefined` | `a` is `null` or `undefined` |
| `a ?? b` | Nullish coalescing | `a` or `b` | `a` is **not** `null`/`undefined` |
| `a ??= b` | Nullish assignment | assigns `b` to `a` | `a` is already non-nullish |
| `a \|\| b` | Logical OR | `a` or `b` | `a` is truthy |
| `a && b` | Logical AND | `a` or `b` | `a` is falsy |

**TypeScript version availability:**

| Operator | Introduced in TypeScript | ECMAScript Equivalent |
|----------|--------------------------|-----------------------|
| `?.` | TypeScript 3.7 | ES2020 |
| `??` | TypeScript 3.7 | ES2020 |
| `??=` | TypeScript 4.0 | ES2021 |

> **tsconfig.json note:** With `"target": "esnext"` (set in this project), all three operators are emitted as-is in the compiled output — the TypeScript compiler does not need to polyfill or downlevel them. Targeting `"es5"` or `"es2019"` would cause `tsc` to transform them into equivalent verbose expressions automatically.

---

## License

This project is licensed under the **ISC License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with TypeScript · Node.js · npm

</div>
