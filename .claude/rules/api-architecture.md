# 🔌 7-Layer API Architecture

Claradix uses a **layered API architecture** for clean separation of concerns, type safety, and error handling.

---

## Layer 1: Axios Client (`shared/api/client.ts`)

**Purpose:** Centralized HTTP client configuration.

```ts
import axios from 'axios';
import { getAuthToken, setAuthToken, refreshToken } from '@/shared/config/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Auto-attach Authorization header
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token queue pattern (prevent parallel requests)
      if (!refreshing) {
        refreshing = refreshToken()
          .then((newToken) => {
            setAuthToken(newToken);
            return newToken;
          })
          .finally(() => {
            refreshing = null;
          });
      }
      const token = await refreshing;
      error.config.headers.Authorization = `Bearer ${token}`;
      return apiClient.request(error.config);
    }
    throw normalizeError(error);
  }
);

export default apiClient;
```

**Rules:**
- ✅ Base URL configured here
- ✅ Timeout set to reasonable value (15s)
- ✅ Request interceptor adds `Authorization` header automatically
- ✅ Response interceptor normalizes all errors to `ApiError`
- ✅ 401 handling uses refresh token queue pattern
- ✅ No direct `axios.get/post` calls outside this file

---

## Layer 2: Typed Request Wrappers (`shared/api/requests.ts`)

**Purpose:** Generic, typed wrapper functions for all HTTP methods.

```ts
import apiClient from './client';
import type { AxiosRequestConfig } from 'axios';

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.get<T>(url, config);
  return data;
}

export async function apiPost<T, D = unknown>(
  url: string,
  body: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.post<T>(url, body, config);
  return data;
}

export async function apiPut<T, D = unknown>(
  url: string,
  body: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.put<T>(url, body, config);
  return data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.delete<T>(url, config);
  return data;
}

export async function apiPatch<T, D = unknown>(
  url: string,
  body: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.patch<T>(url, body, config);
  return data;
}
```

**Rules:**
- ✅ Generic types properly constrained
- ✅ Returns `response.data` directly (not full response)
- ✅ Used ONLY in `entities/*/api/` layer
- ✅ NO direct usage in components or hooks

---

## Layer 3: React Query Config (`shared/api/queryClient.ts`)

**Purpose:** Global React Query defaults and client setup.

```ts
import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10,   // 10 minutes
        retry: (failureCount, error) => {
          // Only retry GET requests (idempotent)
          const isIdempotent = error?.config?.method?.toLowerCase() === 'get';
          return isIdempotent && failureCount < 3;
        },
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: false, // NO retry for POST/PUT/DELETE (idempotency risk)
      },
    },
  });
}

export const queryClient = createQueryClient();
```

**Rules:**
- ✅ `staleTime` set appropriately
- ✅ Retry ONLY for GET requests
- ✅ NO auto-retry for mutations (POST/PUT/DELETE)
- ✅ Error handling in interceptors (Layer 1)
- ✅ Local overrides allowed per query

---

## Layer 4: React Query Wrappers (`shared/api/useApi.ts`)

**Purpose:** Standard hooks wrapping React Query's object API.

```tsx
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type ApiError = {
  message: string;
  status: number;
  code?: string;
};

export function useApiQuery<TData = unknown, TError = ApiError>(
  queryKey: (string | number | object)[],
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useApiMutation<
  TData = unknown,
  TError = ApiError,
  TVariables = unknown
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}
```

**Rules:**
- ✅ Always used instead of raw `useQuery`/`useMutation`
- ✅ Generic types properly constrained
- ✅ Error type is normalized `ApiError`
- ✅ Only used in `features/*/api/` layer

---

## Layer 5: Entity API (`entities/<entity>/api/<entity>Api.ts`)

**Purpose:** Entity-specific API functions using typed wrappers.

```ts
// entities/buyer/api/buyerApi.ts
import { apiGet, apiPost, apiPut, apiDelete } from '@/shared/api/requests';
import type { Buyer, CreateBuyerDto, UpdateBuyerDto } from '../model/types';

export const buyerApi = {
  getBuyers: (params?: { status?: string; limit?: number }) =>
    apiGet<Buyer[]>('/buyer', { params }),

  getBuyerById: (id: string) =>
    apiGet<Buyer>(`/buyer/${id}`),

  createBuyer: (data: CreateBuyerDto) =>
    apiPost<Buyer, CreateBuyerDto>('/buyer', data),

  updateBuyer: (id: string, data: UpdateBuyerDto) =>
    apiPut<Buyer, UpdateBuyerDto>(`/buyer/${id}`, data),

  deleteBuyer: (id: string) =>
    apiDelete<void>(`/buyer/${id}`),
};
```

**Rules:**
- ✅ Only uses typed request wrappers (Layer 2)
- ✅ Never uses raw `apiClient.get/post`
- ✅ Properly typed return values and parameters
- ✅ Query parameters passed correctly
- ✅ Exported as object/namespace for clean API

---

## Layer 6: Feature Hook (`features/<entity>/api/use<Entities>.ts`)

**Purpose:** React Query hook wrapping entity API.

```tsx
// features/buyer-list/api/useBuyers.ts
import { useApiQuery } from '@/shared/api/useApi';
import { buyerApi } from '@/entities/buyer/api/buyerApi';
import type { Buyer } from '@/entities/buyer/model/types';

export function useBuyers(params?: { status?: string; limit?: number }) {
  return useApiQuery<Buyer[], unknown>(
    ['buyers', params], // Query key includes params for cache busting
    () => buyerApi.getBuyers(params),
    {
      enabled: true, // Always enabled
    }
  );
}

// features/create-buyer/api/useCreateBuyer.ts
import { useApiMutation } from '@/shared/api/useApi';
import { buyerApi } from '@/entities/buyer/api/buyerApi';
import type { CreateBuyerDto } from '@/entities/buyer/model/types';

export function useCreateBuyer() {
  return useApiMutation(
    (data: CreateBuyerDto) => buyerApi.createBuyer(data),
    {
      onSuccess: (data) => {
        // Invalidate buyers list after creation
        queryClient.invalidateQueries({ queryKey: ['buyers'] });
      },
    }
  );
}
```

**Rules:**
- ✅ Query keys: `['entityPlural', params?]`
- ✅ Query keys always deterministic and serializable
- ✅ Uses `useApiQuery`/`useApiMutation` (never raw hooks)
- ✅ Parameters passed through to entity API
- ✅ Error handling happens in Layer 1 (axios interceptor)

---

## Layer 7: UI Widget (`widgets/<entity>-list/ui/<Entity>List.tsx`)

**Purpose:** Client component consuming feature hooks.

```tsx
'use client';

import { useBuyers } from '@/features/buyer-list';
import { BuyerCard } from '@/entities/buyer/ui/BuyerCard';
import { Loading, Error } from '@/shared/ui';
import { useTranslations } from 'next-intl';

export function BuyersWidget() {
  const t = useTranslations('BuyersWidget');
  const { data, isLoading, error } = useBuyers();

  // Handle all states
  if (isLoading) return <Loading />;
  
  if (error) {
    // Error is already normalized to ApiError by Layer 1
    return <Error message={String((error as any)?.message)} />;
  }
  
  if (!data?.length) return <p>{t('noData')}</p>;

  return (
    <div className="grid gap-4">
      {data.map(buyer => (
        <BuyerCard key={buyer.id} buyer={buyer} />
      ))}
    </div>
  );
}
```

**Rules:**
- ✅ `'use client'` directive at top
- ✅ Uses feature hooks (Layer 6)
- ✅ Handles all states: loading, error, empty, data
- ✅ Error message safely rendered: `String((error as any)?.message)`
- ✅ All text translated with `useTranslations()`
- ✅ NO API calls directly in component

---

## 🔒 Security & Validation Rules

### Forbidden Patterns (NEVER DO THIS)

```tsx
// ❌ Direct axios usage
import axios from 'axios';
const response = await axios.get('/buyer');  // FORBIDDEN!

// ❌ Direct apiClient usage
import apiClient from '@/shared/api/client';
const response = await apiClient.get('/buyer');  // FORBIDDEN! (use Layer 2)

// ❌ Raw useQuery without wrapper
import { useQuery } from '@tanstack/react-query';
const { data } = useQuery({ ... });  // FORBIDDEN! (use Layer 4)

// ❌ Manual Authorization header
const config = { headers: { Authorization: `Bearer ${token}` } };  // FORBIDDEN! (interceptor handles it)

// ❌ Unsafe error rendering
<p>{error}</p>  // FORBIDDEN! (not all errors are ReactNode)

// ❌ Raw promises without React Query
async function fetchBuyers() {
  return fetch('/buyer').then(r => r.json());  // FORBIDDEN! (use apiGet)
}
```

### Enforced Patterns (ALWAYS DO THIS)

```tsx
// ✅ Use typed request wrappers (Layer 2)
const buyers = await apiGet<Buyer[]>('/buyer');

// ✅ Use feature hooks (Layer 6)
const { data, isLoading, error } = useBuyers();

// ✅ Safely render errors
<p>{String((error as any)?.message)}</p>

// ✅ Handle all states in UI
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data?.length) return <Empty />;
return <List data={data} />;

// ✅ Use query invalidation for mutations
onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buyers'] }),
```

---

## 📊 Adding a New Endpoint: Step-by-Step

### 1. Define Entity Types (`entities/buyer/model/types.ts`)
```ts
export interface Buyer { id: string; name: string; }
export type CreateBuyerDto = Omit<Buyer, 'id'>;
```

### 2. Create Entity API (`entities/buyer/api/buyerApi.ts`)
```ts
export const buyerApi = {
  getBuyers: () => apiGet<Buyer[]>('/buyer'),
  createBuyer: (data: CreateBuyerDto) => apiPost<Buyer>('/buyer', data),
};
```

### 3. Create Feature Hook (`features/buyer-list/api/useBuyers.ts`)
```ts
export const useBuyers = () =>
  useApiQuery<Buyer[]>(['buyers'], buyerApi.getBuyers);
```

### 4. Export from layer `index.ts` files
```ts
// entities/buyer/index.ts
export { type Buyer } from './model/types';
export { buyerApi } from './api/buyerApi';

// features/buyer-list/index.ts
export { useBuyers } from './api/useBuyers';
```

### 5. Create UI Widget (`widgets/buyer-list-widget/ui/BuyerListWidget.tsx`)
```tsx
'use client';
const { data, isLoading, error } = useBuyers();
// Handle states and render...
```

### 6. Use in Page (`app/[locale]/buyers/page.tsx`)
```tsx
import { BuyerListWidget } from '@/widgets/buyer-list-widget';
export default function Page() {
  return <BuyerListWidget />;
}
```

---

## ✅ API Architecture Checklist

- [ ] Layer 1: Axios client configured
- [ ] Layer 2: Typed request wrappers created
- [ ] Layer 3: React Query client created
- [ ] Layer 4: React Query wrappers exported
- [ ] Layer 5: Entity API functions defined
- [ ] Layer 6: Feature hook wraps Layer 5
- [ ] Layer 7: UI component uses Layer 6
- [ ] All layers export via `index.ts`
- [ ] All imports use path aliases
- [ ] No circular dependencies
- [ ] Error handling tested
- [ ] Type safety verified

---

## 🔗 Related Rules

- [[fsd-architecture]] — Layer placement in FSD
- [[typescript-rules]] — Type safety guidelines
- [[security]] — Security best practices

---

**Last Updated:** 2026-06-18
