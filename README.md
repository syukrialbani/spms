# Aviat SPMS (Spare Part Management System) — Frontend

Aplikasi web frontend untuk operasional **SPMS (Spare Part Management System)** Aviat yang mengelola siklus permintaan spare part, **Delivery Order (Delivery & Pickup)**, upload **Berita Acara (BA)**, dan **multi-stage approval**.

## Tech Stack

- **React 19** + **TypeScript 6** + **Vite 8** (dengan React Compiler)
- **MUI v9** (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`)
- **React Router DOM v7**
- **TanStack React Query v5** + **Axios**
- **Formik** + **Yup**
- **Recharts** & **Day.js**

## Struktur Folder (Feature-Sliced Design)

```text
src/
├── app/        # Providers, Router, ProtectedRoute, Theme MUI
├── pages/      # Halaman (login, dashboard, spms-*, delivery-order)
├── widgets/    # AppShell, MainAppBar, MainNavigation
├── features/   # auth, spms-list, spms-form
├── entities/   # spms, delivery-order, user (types, status, options, storage)
├── shared/     # api client, lib helpers, reusable UI primitives
└── assets/     # Logo & brand assets
```

## Scripts

```bash
npm install
npm run dev      # Jalankan dev server Vite
npm run lint     # Jalankan ESLint
npm run build    # Type-check (tsc -b) + production build
npm run preview  # Preview hasil build
```
