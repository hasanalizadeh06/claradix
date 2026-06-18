# 🏗️ Feature-Sliced Design (FSD) Architecture

## Core Principle

Feature-Sliced Design is a scalable and maintainable architecture pattern where code is organized by **features**, not by **technical layers**. Each feature is self-contained and can be independently developed and tested.

---

## Layer Structure

### 1. **shared/** — Reusable Across All Layers

Code that can be used anywhere in the application.

```
shared/
├── ui/                    # Reusable UI components (Button, Input, Card, etc.)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── ...
├── api/                   # API infrastructure
│   ├── client.ts          # Axios client
│   ├── requests.ts        # Typed request wrappers
│   ├── useApi.ts          # React Query hooks
│   ├── queryClient.ts     # React Query configuration
│   └── index.ts
├── lib/                   # Utilities & helpers
│   ├── utils.ts
│   ├── validators.ts
│   └── index.ts
├── config/                # Global configuration
│   ├── api.config.ts
│   └── index.ts
└── types/                 # Global types
    └── api.types.ts
```

**Import Rule:** `shared` → nothing (only exports to other layers)

---

### 2. **entities/** — Business Logic Entities

Domain objects that represent core business concepts.

```
entities/
├── buyer/
│   ├── model/
│   │   ├── types.ts       # Buyer interface, DTOs
│   │   ├── types.test.ts
│   │   └── index.ts
│   ├── api/
│   │   ├── buyerApi.ts    # API calls (uses shared/api/requests)
│   │   ├── buyerApi.test.ts
│   │   └── index.ts
│   ├── ui/                (optional)
│   │   └── BuyerCard.tsx
│   └── index.ts
└── [other-entities]/
```

**Example: types.ts**

```ts
export interface Buyer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

export type CreateBuyerDto = Omit<Buyer, "id">;
```

**Example: buyerApi.ts**

```ts
import { apiGet, apiPost } from "@/shared/api/requests";
import type { Buyer, CreateBuyerDto } from "../model/types";

export const buyerApi = {
  getBuyers: () => apiGet<Buyer[]>("/buyer"),
  getBuyerById: (id: string) => apiGet<Buyer>(`/buyer/${id}`),
  createBuyer: (data: CreateBuyerDto) =>
    apiPost<Buyer, CreateBuyerDto>("/buyer", data),
};
```

**Import Rule:** `entities` → `shared` only

---

### 3. **features/** — User Actions & Feature Logic

Implements specific user actions and features using entities.

```
features/
├── buyer-list/
│   ├── api/
│   │   ├── useBuyers.ts        # React Query hook (uses useApiQuery)
│   │   ├── useBuyers.test.ts
│   │   └── index.ts
│   ├── ui/                (optional - if feature has specific components)
│   │   ├── BuyerFilter.tsx
│   │   └── index.ts
│   └── index.ts
├── create-buyer/
│   ├── api/
│   │   ├── useCreateBuyer.ts   # React Query mutation
│   │   └── index.ts
│   └── index.ts
└── [other-features]/
```

**Example: useBuyers.ts**

```ts
import { useApiQuery } from "@/shared/api/useApi";
import { buyerApi } from "@/entities/buyer/api/buyerApi";
import type { Buyer } from "@/entities/buyer/model/types";

export const useBuyers = () =>
  useApiQuery<Buyer[], unknown>(["buyers"], buyerApi.getBuyers);
```

**Import Rule:** `features` → `entities`, `shared` only

---

### 4. **widgets/** — Complex Page Sections

Independent, composable page sections that combine multiple features/entities.

```
widgets/
├── buyer-list-widget/
│   ├── ui/
│   │   ├── BuyerListWidget.tsx      # Client component
│   │   ├── BuyerListWidget.test.tsx
│   │   └── index.ts
│   └── index.ts
├── header/
│   ├── ui/
│   │   ├── Header.tsx
│   │   └── index.ts
│   └── index.ts
└── [other-widgets]/
```

**Example: BuyerListWidget.tsx**

```tsx
"use client";

import { useBuyers } from "@/features/buyer-list";
import { BuyerCard } from "@/entities/buyer/ui/BuyerCard";
import { Loading, Error } from "@/shared/ui";

export function BuyerListWidget() {
  const { data, isLoading, error } = useBuyers();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  if (!data?.length) return <p>No buyers found</p>;

  return (
    <div className="grid gap-4">
      {data.map((buyer) => (
        <BuyerCard key={buyer.id} buyer={buyer} />
      ))}
    </div>
  );
}
```

**Import Rule:** `widgets` → `features`, `entities`, `shared` only

---

### 5. **app/** — NextJS Pages & Routing

Lowest-level components that handle routing and page composition.

```
app/
├── [locale]/                       # i18n routing
│   ├── layout.tsx                  # Root layout + providers
│   ├── page.tsx                    # Home page
│   ├── buyers/
│   │   ├── page.tsx                # Buyers list page
│   │   ├── [id]/
│   │   │   └── page.tsx            # Buyer detail page
│   │   └── layout.tsx              (optional)
│   ├── not-found.tsx               # 404 page
│   └── error.tsx                   # Error boundary
├── middleware.ts                   # Locale detection
└── favicon.ico
```

**Example: app/[locale]/buyers/page.tsx**

```tsx
import { useTranslations } from "next-intl";
import { BuyerListWidget } from "@/widgets/buyer-list-widget";

export const metadata = {
  title: "Buyers",
  description: "Manage all buyers",
};

export default function BuyersPage() {
  const t = useTranslations("BuyersPage");

  return (
    <main id="main-content" className="container mx-auto py-8">
      <h1>{t("title")}</h1>
      <BuyerListWidget />
    </main>
  );
}
```

**Import Rule:** `app` → `widgets`, `shared` only (NO direct entity/feature imports)

---

## 📏 Import Direction Rules (STRICTLY ENFORCED)

```
✅ ALLOWED:
  app → widgets, shared
  widgets → features, entities, shared
  features → entities, shared
  entities → shared
  shared → nothing

❌ FORBIDDEN:
  shared → anything
  entities → features, widgets, app
  features → widgets, app
  widgets → app
  ANY circular imports
```

### Violation Examples

```tsx
// ❌ WRONG: entities importing from features
import { useBuyers } from '@/features/buyer-list';  // ← FORBIDDEN!
export const buyerApi = { ... };

// ✅ CORRECT: features importing from entities
import { buyerApi } from '@/entities/buyer/api/buyerApi';
export const useBuyers = () => useApiQuery(...);

// ❌ WRONG: app importing directly from entities
import { buyerApi } from '@/entities/buyer/api/buyerApi';  // ← Use widget instead!
export default function Page() { ... }

// ✅ CORRECT: app importing from widgets
import { BuyerListWidget } from '@/widgets/buyer-list-widget';
export default function Page() { ... }
```

---

## 🎯 File Placement Decision Tree

**Q: Is this a UI component that can be reused anywhere?**
→ `shared/ui/`

**Q: Is this a business logic entity (types, API calls)?**
→ `entities/[name]/model/` (types) or `entities/[name]/api/` (API)

**Q: Is this a React Query hook that uses an entity?**
→ `features/[name]/api/`

**Q: Is this a complex page section combining multiple features?**
→ `widgets/[name]/ui/`

**Q: Is this a utility function?**
→ `shared/lib/`

**Q: Is this a NextJS page/route?**
→ `app/[locale]/[path]/page.tsx`

---

## 📤 Public API (index.ts)

Every FSD layer must have an `index.ts` that exports its public API:

```ts
// entities/buyer/index.ts
export { type Buyer, type CreateBuyerDto } from "./model/types";
export { buyerApi } from "./api/buyerApi";
export { BuyerCard } from "./ui/BuyerCard";

// features/buyer-list/index.ts
export { useBuyers } from "./api/useBuyers";

// widgets/buyer-list-widget/index.ts
export { BuyerListWidget } from "./ui/BuyerListWidget";
```

**Then use path aliases:**

```tsx
import { Buyer, buyerApi } from "@/entities/buyer";
import { useBuyers } from "@/features/buyer-list";
import { BuyerListWidget } from "@/widgets/buyer-list-widget";
```

---

## ✅ FSD Compliance Checklist

Before creating a file:

- [ ] Correct layer determined
- [ ] Folder exists or needs to be created
- [ ] `index.ts` exists in the layer
- [ ] No import direction violations

After creating a file:

- [ ] Updated layer's `index.ts`
- [ ] All imports use path aliases
- [ ] No relative `../../` imports
- [ ] Circular dependencies checked

---

## 🔗 Related Rules

- [[api-architecture]] — 7-layer API pattern
- [[naming-conventions]] — Folder and file naming
- [[component-standards]] — Component structure and patterns
- [[typescript-rules]] — Type safety guidelines

---

**Last Updated:** 2026-06-18
