---
name: create-entity
description: Create a complete entity with types, API, hooks, and widget (FSD pattern)
argument-hint: "Entity name (singular, e.g., 'buyer')"
---

# /create-entity

Creates a complete feature entity following FSD architecture and the 7-layer API pattern.

## Usage

```bash
/create-entity buyer
/create-entity product
/create-entity user-profile
```

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
  status: 'active' | 'inactive';
}

export type CreateBuyerDto = Omit<Buyer, 'id'>;
export type UpdateBuyerDto = Partial<CreateBuyerDto> & { id: string };
```

### buyerApi.ts
```ts
import { apiGet, apiPost, apiPut, apiDelete } from '@/shared/api/requests';
import type { Buyer, CreateBuyerDto, UpdateBuyerDto } from '../model/types';

export const buyerApi = {
  getBuyers: () => apiGet<Buyer[]>('/buyer'),
  getBuyerById: (id: string) => apiGet<Buyer>(`/buyer/${id}`),
  createBuyer: (data: CreateBuyerDto) => apiPost<Buyer>('/buyer', data),
  updateBuyer: (id: string, data: UpdateBuyerDto) => apiPut<Buyer>(`/buyer/${id}`, data),
  deleteBuyer: (id: string) => apiDelete<void>(`/buyer/${id}`),
};
```

### useBuyers.ts
```ts
import { useApiQuery } from '@/shared/api/useApi';
import { buyerApi } from '@/entities/buyer/api/buyerApi';
import type { Buyer } from '@/entities/buyer/model/types';

export const useBuyers = () =>
  useApiQuery<Buyer[], unknown>(['buyers'], buyerApi.getBuyers);
```

### BuyerListWidget.tsx
```tsx
'use client';

import { useBuyers } from '@/features/buyer-list';
import { BuyerCard } from '@/entities/buyer/ui/BuyerCard';
import { Loading, Error, Empty } from '@/shared/ui';
import { useTranslations } from 'next-intl';

export function BuyerListWidget() {
  const t = useTranslations('BuyersWidget');
  const { data, isLoading, error } = useBuyers();

  if (isLoading) return <Loading />;
  if (error) return <Error message={String((error as any)?.message)} />;
  if (!data?.length) return <Empty message={t('noData')} />;

  return (
    <div className="grid gap-4">
      {data.map(buyer => <BuyerCard key={buyer.id} buyer={buyer} />)}
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
