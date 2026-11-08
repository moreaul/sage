C'est CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sage is a Tauri 2 desktop app (Rust backend + React/TypeScript frontend) for managing diseases, treatments, and their relationships (cures, drug interactions) — a medical reference tool. It is an early-stage project; `src/pages/home.tsx` is leftover Tauri template scaffolding not wired into the app.

## Commands

- `npm run tauri dev` — run the full desktop app (starts Vite dev server + Rust/Tauri shell). This is the primary way to run the app during development.
- `npm run dev` — Vite dev server only (frontend in browser, no Tauri/SQL plugin backing it — `initDb`/`invoke` calls will fail without the Tauri runtime).
- `npm run build` — type-check (`tsc`) then build frontend (`vite build`). Run this to validate TypeScript changes.
- `npm run tauri build` — produce a release desktop bundle.
- Rust side: `cd src-tauri && cargo build` / `cargo check` for a faster Rust-only compile check.

There is no test suite or linter configured in this repo currently.

## Architecture

### Frontend/backend split

- Rust (`src-tauri/`) owns the SQLite database via the `tauri-plugin-sql` plugin, plus any native commands exposed through `#[tauri::command]` (see `greet` in `lib.rs` as the template example — not used by the real app).
- React (`src/`) talks to SQLite directly from the frontend using `@tauri-apps/plugin-sql`'s `Database` API (not via custom Rust commands) — see `src/database/db.ts`. Only reach for a `#[tauri::command]` in Rust when logic can't be expressed as SQL from the frontend.

### Database

- Schema and seed data live in Rust, not in `.sql` files: `src-tauri/src/migrations.rs` defines versioned `Migration` entries (schema in migration 1, seed data in migration 2 via `seeds.rs`), registered in `lib.rs` through `tauri_plugin_sql::Builder::add_migrations("sqlite:app.db", migrations::all())`. To change the schema, add a **new** migration entry with an incremented `version` rather than editing an existing one — migrations already applied to a user's `app.db` won't rerun, and sqlx refuses to start if an applied migration's SQL has changed (checksum). Current migrations: 1 schema, 2 original English test seed (frozen, don't edit), 3 `Disease.description`, 4 French naturopathy example data (`seeds::naturopathy_seed_data`: removes the old English seed rows by name, then inserts by name with `WHERE NOT EXISTS` so it never overwrites or collides with user data), 5 `Treatment_type.icon`.
- Solution icons: hand-drawn SVGs in `src/components/solutionIcons.tsx`, keyed by a string stored in `Treatment_type.icon` (never rename a key; unknown/null falls back to `sprout`). `SolutionChip` shows icon + name; the solution form has an icon picker and suggests one from the name.
- Core tables: `Disease`, `Treatment`, `Treatment_type`, `cure` (disease↔treatment join with usage notes), `interaction` (treatment↔treatment join for contraindications/drug interactions).
- Frontend DB access follows a repository pattern: `src/database/db.ts` holds a singleton `Database` handle (`initDb()` called once at bootstrap in `main.tsx`, `getDb()` used elsewhere and throws if called before init). Per-entity query functions live in `src/database/*Repository.ts` (`disease`, `treatment` (incl. interactions), `treatmentType`, `cure`), which select raw rows and map them through a model class's static `fromRow` (`src/model/*.ts`). Follow this pattern for new queries.
- Writes need the `sql:allow-execute` permission (`src-tauri/capabilities/default.json`); `sql:default` is read-only.
- Foreign keys are not enforced at runtime (`PRAGMA foreign_keys` is per-connection and the plugin uses a pool), so repositories delete child rows (`cure`, `interaction`) explicitly before parents. Avoid `BEGIN`/`COMMIT` from the frontend for the same reason (statements may run on different pooled connections).
- `interaction` is treated as symmetric: queries check both columns.

### UI structure

- `src/pages/newapp.tsx` is the real app shell currently rendered by `App.tsx` (sidebar + main content). `src/pages/home.tsx` and `src/components/Tabs.tsx` are unused template leftovers — don't build on them.
- `src/components/SearchContainer.tsx` wraps `AppTabs` (a generic, reusable tabbed-container component over HeroUI's `Tabs`) with three tabs. Domain meaning (don't confuse "Solutions" with `cure`):
  - **Pathologies** (`pathologies/`) = `Disease` + the treatments that cure it (`cure`, with `usage`), edited from the pathology form.
  - **Traitements** (`treatments/`) = CRUD on `Treatment`, incl. its solution and its interactions.
  - **Solutions** (`solutions/`) = `Treatment_type`, a category such as "Huile essentielle" shared by many treatments. Deleting one still used by treatments is refused (`id_type` is NOT NULL).
- Each tab component loads its data, filters it client-side (`src/utils/search.ts`, accent-insensitive) and renders the generic `ResultsContainer` (search bar + scrollable list with view/edit/delete) plus its own View/Form modals and `ConfirmDeleteModal`. Modals are mounted only while open, so their state resets each time. Inactive tab panels are unmounted by HeroUI, so switching tabs reloads from the DB. Errors/success go through toasts (`src/utils/notify.ts`).
- UI uses [HeroUI](https://www.heroui.com/) components + Tailwind v4. The import alias `@/*` maps to the project root (not `src/`) per `tsconfig.json`/`vite.config.ts`, so frontend imports look like `@/src/components/...`.
- Tailwind v4 is configured via CSS (`src/App.css`: `@import "tailwindcss"`, `@plugin "../hero.ts"`, `@source` globs), not a `tailwind.config.js` — `tailwind-backup.config.ts` at the repo root is an unused leftover from before the v4 migration. The HeroUI plugin/theme is defined in `hero.ts`: it overrides HeroUI's built-in `light`/`dark` themes with the colors of the old Python (CustomTkinter green) version. Use the semantic surface tokens rather than raw colors: `bg-background` (window), `bg-content1` (main panel, list rows, modals), `bg-content2` (sidebar, list area, cards inside modals), `bg-content3` (tab bar), `bg-content4` (inputs), `primary` (green). Scrollbar colors are in `src/App.css`.
- Light/dark mode: `src/theme.ts` (`useTheme`) puts the `light`/`dark` class on `<html>` (not `<main>`, so portaled modals/toasts follow it) and persists it in `localStorage` (`sage-theme`). An inline script in `index.html` applies the saved theme before first paint; keep its key in sync. The toggle is `src/components/sidebar/ThemeSwitch.tsx`.

### Backup (export / import)

- Sidebar `BackupSection` exports/imports all data as a JSON file (`src/database/backupRepository.ts`: `exportBackup`, `parseBackup`, `importBackup`). File dialogs come from `@tauri-apps/plugin-dialog`; the file is read/written by the Rust commands `write_backup_file` / `read_backup_file` in `lib.rs` (no fs plugin).
- `parseBackup` validates everything (types, duplicate keys, references) before any write. `importBackup` replaces all data in **one** multi-statement `execute` (`BEGIN … INSERT OR ROLLBACK … COMMIT`) so it runs on a single pooled connection and is all-or-nothing; values are inlined as escaped SQL literals because a multi-statement script can't take bind params.
- **When the schema changes**, update the backup too: bump `BACKUP_FORMAT_VERSION`, export/import the new columns, and convert older versions in `parseBackup` so existing backup files stay importable.

### Releases & auto-update

- The app updates itself via `tauri-plugin-updater` (+ `tauri-plugin-process` for relaunch). `src/components/sidebar/UpdateSection.tsx` checks silently at startup (skipped in dev), offers a manual check, and shows the install modal. Endpoint: `https://github.com/moreaul/sage/releases/latest/download/latest.json` (repo must stay public); `plugins.updater.pubkey` in `tauri.conf.json` must match the signing key.
- Single version source: `package.json` (`tauri.conf.json` has `"version": "../package.json"`; `Cargo.toml`'s version is unused).
- To release: `npm version patch|minor` (bumps, commits and tags `vX.Y.Z`), then `git push --follow-tags`. `.github/workflows/release.yml` (tauri-action, `windows-latest`, NSIS only) builds, signs with the `TAURI_SIGNING_PRIVATE_KEY` / `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` repo secrets and publishes the Release with `latest.json`.
- The private key (`~/.tauri/sage.key`) must never be lost or committed: without it, installed apps can no longer be updated.
