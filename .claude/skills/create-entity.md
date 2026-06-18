---
name: create-entity
description: Create a complete entity with types, API, hooks, and widget (FSD pattern)
argument-hint: "Entity name + business context (e.g., 'buyer customers who purchase products')"
---

# /create-entity

Creates a complete feature entity following FSD architecture and the 7-layer API pattern.

## Format

```bash
/create-entity [entity-name] [business-context]
```

**[entity-name]:** Single word, kebab-case (buyer, product, order, invoice)
**[business-context]:** Domain description + relationships + fields overview

## Usage Examples

✅ **Full (with context):**

```bash
/create-entity buyer customers who purchase, has orders and invoices, fields: name, email, phone, status
/create-entity product physical items we sell, category and supplier relationships, stock management needed
/create-entity order customer purchases, order items, timestamps, status tracking
```

❌ **Incomplete (missing context):**

```bash
/create-entity buyer
↓
Me: I need more info!

✓ Entity name? → buyer
✓ Business context? → customers who make purchases, have orders and invoices
```

✅ **Minimal (just name, I'll ask):**

```bash
/create-entity invoice
↓
Me: What's the business context?
→ Answer: bills sent to customers, linked to orders
```

## If Arguments Are Missing

**You run:** `/create-entity` (incomplete)

**I immediately ask:**

```
✓ Entity name? (singular, kebab-case: buyer, product, order)
  → Your answer: buyer

✓ Business context? (what is it? why needed? key fields/relationships?)
  → Your answer: customers who buy products, has orders and invoices,
                 fields: name, email, phone, status, company, tax_id
```

Once provided, I proceed with detailed analysis questions.

---

## Questions I Will Ask

After you provide entity name + context, I will ask:

**Domain & Business Logic:**

- [ ] What exactly is a {entity}? (Full definition)
- [ ] Why is this entity needed? (Which features depend on it?)
- [ ] Are there subtypes? (e.g., individual vs business buyer?)
- [ ] What's the lifecycle? (Created → Active → Inactive → Deleted?)

**Data & Fields:**

- [ ] What are ALL the fields? (Exact names, types, required?)
- [ ] Which fields are unique? (email, username, sku?)
- [ ] Which fields allow null? (optional fields?)
- [ ] Do we need timestamps? (createdAt, updatedAt, deletedAt?)
- [ ] Any enums/statuses? (what are the values?)
- [ ] File uploads needed? (images, documents?)
- [ ] Large text fields? (description, notes?)

**Relationships:**

- [ ] What entities does this relate to?
  - One-to-many? (buyer hasMany orders)
  - Many-to-one? (order belongsTo buyer)
  - Many-to-many? (student hasManyThrough courses)
- [ ] Are relationships required or optional?
- [ ] What happens on delete? (cascade? soft delete?)
- [ ] Are there circular references? (buyer ↔ company)

**API & Endpoints:**

- [ ] CRUD endpoints needed? (GET, POST, PUT, DELETE?)
- [ ] List endpoint needed? (pagination? filtering? sorting?)
- [ ] Search/autocomplete endpoint?
- [ ] Endpoint path? (/api/v1/buyers? /buyers? /customers?)
- [ ] Who can access? (public? authenticated? admin-only?)
- [ ] Response format? (full object? partial fields? nested?)

**Validation & Constraints:**

- [ ] Required fields?
- [ ] Email/phone format validation?
- [ ] String length constraints? (min/max?)
- [ ] Number ranges? (price >= 0?)
- [ ] Enum validation?
- [ ] Custom business rules? (email must be unique? status workflow?)

**Performance & Scale:**

- [ ] Expected data volume? (100s? 1000s? millions?)
- [ ] Index needed? (on what fields?)
- [ ] Query complexity? (need eager loading? select specific fields?)

---

## What It Creates

For an entity named `buyer`, creates:

```
entities/buyer/
├── model/
│   ├── types.ts              # Buyer interface, DTOs
│   ├── types.test.ts
│   └── index.ts
├── api/
│   ├── buyerApi.ts          # API calls (Layer 5)
│   ├── buyerApi.test.ts
│   └── index.ts
├── ui/                      (optional)
│   ├── BuyerCard.tsx
│   ├── BuyerCard.test.tsx
│   └── index.ts
└── index.ts

features/buyer-list/
├── api/
│   ├── useBuyers.ts         # Query hook (Layer 6)
│   ├── useBuyers.test.ts
│   └── index.ts
└── index.ts

features/create-buyer/
├── api/
│   ├── useCreateBuyer.ts    # Mutation hook (Layer 6)
│   ├── useCreateBuyer.test.ts
│   └── index.ts
└── index.ts

widgets/buyer-list-widget/
├── ui/
│   ├── BuyerListWidget.tsx  # Page section (Layer 7)
│   ├── BuyerListWidget.test.tsx
│   └── index.ts
└── index.ts

src/messages/
├── az.json                  # Added Buyers translation namespace
├── en.json
└── ru.json
```

## Generated Code Pattern

### types.ts

```ts
export interface Buyer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

export type CreateBuyerDto = Omit<Buyer, "id">;
export type UpdateBuyerDto = Partial<CreateBuyerDto> & { id: string };
```

### buyerApi.ts

```ts
import { apiGet, apiPost, apiPut, apiDelete } from "@/shared/api/requests";
import type { Buyer, CreateBuyerDto, UpdateBuyerDto } from "../model/types";

export const buyerApi = {
  getBuyers: () => apiGet<Buyer[]>("/buyer"),
  getBuyerById: (id: string) => apiGet<Buyer>(`/buyer/${id}`),
  createBuyer: (data: CreateBuyerDto) => apiPost<Buyer>("/buyer", data),
  updateBuyer: (id: string, data: UpdateBuyerDto) =>
    apiPut<Buyer>(`/buyer/${id}`, data),
  deleteBuyer: (id: string) => apiDelete<void>(`/buyer/${id}`),
};
```

### useBuyers.ts

```ts
import { useApiQuery } from "@/shared/api/useApi";
import { buyerApi } from "@/entities/buyer/api/buyerApi";
import type { Buyer } from "@/entities/buyer/model/types";

export const useBuyers = () =>
  useApiQuery<Buyer[], unknown>(["buyers"], buyerApi.getBuyers);
```

### BuyerListWidget.tsx

```tsx
"use client";

import { useBuyers } from "@/features/buyer-list";
import { BuyerCard } from "@/entities/buyer/ui/BuyerCard";
import { Loading, Error, Empty } from "@/shared/ui";
import { useTranslations } from "next-intl";

export function BuyerListWidget() {
  const t = useTranslations("BuyersWidget");
  const { data, isLoading, error } = useBuyers();

  if (isLoading) return <Loading />;
  if (error) return <Error message={String((error as any)?.message)} />;
  if (!data?.length) return <Empty message={t("noData")} />;

  return (
    <div className="grid gap-4">
      {data.map((buyer) => (
        <BuyerCard key={buyer.id} buyer={buyer} />
      ))}
    </div>
  );
}
```

## Translation Updates

Automatically adds to all `messages/[locale].json`:

```json
{
  "BuyersWidget": {
    "noData": "No buyers found",
    "title": "Buyers"
  }
}
```

## Validation

After creation, runs:

- ✅ Type check (`npm run type-check`)
- ✅ Tests pass
- ✅ All imports valid
- ✅ All exports in index.ts present

## Rollback

If any step fails, all changes are reverted with detailed error report.
