# 📘 TypeScript Strict Mode Rules

Claradix enforces **strict TypeScript** mode for type safety across the entire codebase.

---

## 🚨 Core Rules

### No `any` Type

```ts
// ❌ WRONG
const response: any = await apiClient.get('/data');
const value: any = data;

// ✅ CORRECT
const response: Buyer[] = await apiGet<Buyer[]>('/buyer');
const value: string = data as string;
```

### Proper Type Inference

```ts
// ❌ WRONG
const users = [];  // type: any[]

// ✅ CORRECT
const users: Buyer[] = [];
const users = fetchBuyers();  // Inferred from return type
```

### No Implicit `any`

```ts
// ❌ WRONG
function processData(data) {  // data: any
  return data.name;
}

// ✅ CORRECT
function processData(data: Buyer): string {
  return data.name;
}

// ✅ CORRECT with generic
function processData<T extends { name: string }>(data: T): string {
  return data.name;
}
```

---

## 📦 Type Definitions

### Interfaces for Objects

```ts
// ✅ CORRECT
interface Buyer {
  id: string;
  name: string;
  email: string;
}

// ✅ CORRECT: Extend interface
interface VipBuyer extends Buyer {
  loyaltyPoints: number;
}
```

### Types for Unions & Literals

```ts
// ✅ CORRECT
type BuyerStatus = 'active' | 'inactive' | 'suspended';

type ApiResponse<T> = {
  data: T;
  error: ApiError | null;
};

// ✅ CORRECT: Discriminated union
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'loading' };
```

### DTOs (Data Transfer Objects)

```ts
// ✅ CORRECT
interface CreateBuyerDto {
  name: string;
  email: string;
}

interface UpdateBuyerDto extends Partial<CreateBuyerDto> {
  id: string;
}

// Usage
const buyer = await buyerApi.createBuyer({ name: 'John', email: 'john@example.com' });
```

---

## 🔍 Null & Undefined Handling

### Never Allow `null` Unless Necessary

```ts
// ❌ WRONG
interface Buyer {
  id: string | null;  // Why could ID be null?
  email: string | null;
}

// ✅ CORRECT: Either required or optional
interface Buyer {
  id: string;
  email: string;
  phone?: string;  // Optional
}

// ✅ CORRECT: For API responses where data may not exist
interface BuyerResponse {
  buyer: Buyer | null;  // Explicit nullable
}
```

### Optional vs Null

```ts
// ❌ WRONG: Mixing optional and null
type Data = {
  value?: string | null;  // Ambiguous
};

// ✅ CORRECT: Use optional when value may not exist
type Data = {
  value?: string;  // undefined if not provided
};

// ✅ CORRECT: Use null for explicit absence
type Response = {
  data: string | null;  // null if API returns no data
};
```

### Null Coalescing & Optional Chaining

```ts
// ✅ CORRECT
const name = buyer?.name ?? 'Unknown';
const email = buyer?.contact?.email ?? '';

// ✅ CORRECT: Non-null assertion (only when 100% certain)
const email = buyer!.email;  // Asserts buyer is not null

// ❌ WRONG: Without optional chaining
const name = buyer.name;  // Error if buyer is null!
const email = buyer.contact.email;  // Error if contact is null!
```

---

## 🔧 Generic Types

### Properly Constrained Generics

```ts
// ✅ CORRECT: Constrained generic
function formatList<T extends { toString(): string }>(items: T[]): string {
  return items.map(item => item.toString()).join(', ');
}

// ✅ CORRECT: React generic
interface ComponentProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}

// ❌ WRONG: Uncons trained generic
function processData<T>(data: T): T {  // Too loose, T could be anything
  return data;
}
```

### React Component Generics

```ts
// ✅ CORRECT
interface ListProps<T> extends React.HTMLAttributes<HTMLUListElement> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({ items, renderItem, ...props }: ListProps<T>) {
  return (
    <ul {...props}>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

---

## 🛡️ Error Handling

### Typed Errors

```ts
// ✅ CORRECT: Custom error type
interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// ✅ CORRECT: In try-catch
async function loadBuyers() {
  try {
    return await apiGet<Buyer[]>('/buyer');
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`Error: ${apiError.message}`);
    throw apiError;
  }
}

// ❌ WRONG: No error typing
try {
  // ...
} catch (error) {
  console.error(error);  // error: unknown
}
```

### React Hook Errors

```ts
// ✅ CORRECT
const { data, error } = useApiQuery<Buyer[], ApiError>(
  ['buyers'],
  buyerApi.getBuyers
);

if (error) {
  // error is safely typed as ApiError | null
  console.error(error.message);
}

// ❌ WRONG: Unsafe error access
if (error) {
  console.error(error.unknownProperty);  // Type error!
}
```

---

## 🔗 Import/Export Types

### Export Types Correctly

```ts
// ✅ CORRECT
export type { Buyer, CreateBuyerDto } from './types';
export { buyerApi } from './api';

// ✅ CORRECT: Re-export from index
export type { Buyer } from './model/types';
export { buyerApi } from './api/buyerApi';

// ❌ WRONG: Default export
export default { buyerApi };  // Avoid for FSD

// ❌ WRONG: Mixing type and value exports
export { Buyer, buyerApi };  // Confusing, separate them
```

### Type-Only Imports

```ts
// ✅ CORRECT: Signals to bundler that import is removed
import type { Buyer } from '@/entities/buyer';

// ✅ CORRECT: Mixed import
import { buyerApi } from '@/entities/buyer';
import type { Buyer } from '@/entities/buyer/model/types';

// ❌ WRONG: No distinction
import { buyerApi, Buyer } from '@/entities/buyer';  // Harder to optimize
```

---

## 🎯 Utility Types

### Common Utility Types

```ts
// ✅ CORRECT: Omit optional fields for POST DTO
type CreateBuyerDto = Omit<Buyer, 'id' | 'createdAt'>;

// ✅ CORRECT: Partial for PATCH DTO
type UpdateBuyerDto = Partial<CreateBuyerDto> & { id: string };

// ✅ CORRECT: Record for maps
type BuyerStatus = 'active' | 'inactive';
const statusColors: Record<BuyerStatus, string> = {
  active: 'green',
  inactive: 'gray',
};

// ✅ CORRECT: Pick for subset
type BuyerPreview = Pick<Buyer, 'id' | 'name' | 'email'>;

// ✅ CORRECT: Readonly for immutability
const config: Readonly<AppConfig> = { ... };

// ✅ CORRECT: ReturnType to get function return
type BuyersResult = Awaited<ReturnType<typeof buyerApi.getBuyers>>;
```

---

## ⚡ Conditional Types (Advanced)

```ts
// ✅ CORRECT: Conditional type
type IsString<T> = T extends string ? true : false;

type X = IsString<'hello'>;  // true
type Y = IsString<number>;   // false

// ✅ CORRECT: Extract matching types
type ResponseTypes = {
  list: Buyer[];
  single: Buyer;
  count: number;
};

type ExtractArrayTypes<T> = T extends Array<infer U> ? U : never;
type BuyerType = ExtractArrayTypes<ResponseTypes['list']>;  // Buyer
```

---

## ✅ TypeScript Checklist

- [ ] `strict: true` in `tsconfig.json`
- [ ] No `any` type used anywhere
- [ ] All function parameters typed
- [ ] All function return types specified
- [ ] No implicit `any`
- [ ] Props interfaces for components
- [ ] Error types properly handled
- [ ] Generic types constrained
- [ ] `import type` for type-only imports
- [ ] No TypeScript errors on build
- [ ] 100% test coverage

---

**Last Updated:** 2026-06-18
