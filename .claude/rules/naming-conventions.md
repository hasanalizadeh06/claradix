# 📝 Naming Conventions

Claradix follows strict naming conventions to ensure consistency and readability across the entire codebase.

---

## 📁 Folder Naming

### General Rule: kebab-case

```
✅ CORRECT
features/buyer-list/
features/create-buyer/
entities/user-profile/
widgets/header/
shared/ui/

❌ WRONG
features/buyerList/          (camelCase)
features/BuyerList/          (PascalCase)
features/buyer_list/         (snake_case)
```

### Entity Folder Structure

```
entities/buyer/
├── model/
├── api/
├── ui/
└── index.ts

# NOT:
entities/Buyer/
entities/buyerEntity/
```

---

## 📄 File Naming

### Components: PascalCase

```ts
✅ CORRECT
BuyerCard.tsx
BuyerForm.tsx
UserProfile.tsx

❌ WRONG
buyerCard.tsx
buyer-card.tsx
BuyerCard.component.tsx
```

### Utilities & Hooks: camelCase

```ts
✅ CORRECT
useBuyers.ts
useBuyerForm.ts
formatPrice.ts
validateEmail.ts

❌ WRONG
UseBuyers.ts
use-buyers.ts
UseBuyers.hook.ts
format-price.ts
```

### Test Files

```ts
✅ CORRECT
BuyerCard.test.tsx
useBuyers.test.ts
formatPrice.test.ts

❌ WRONG
BuyerCard.spec.tsx
BuyerCard.test.ts (for TSX file, use tsx for test)
```

### API Files

```ts
✅ CORRECT
buyerApi.ts
userApi.ts

❌ WRONG
buyer.api.ts
BuyerApi.ts
buyer-api.ts
```

---

## 🏗️ Type & Interface Naming

### Interfaces & Types: PascalCase

```ts
✅ CORRECT
interface Buyer { }
type CreateBuyerDto = { }
type UpdateBuyerDto = { }
type BuyerStatus = 'active' | 'inactive'

❌ WRONG
interface buyer { }
type IBuyer = { }              (no I prefix)
type create_buyer_dto = { }
```

### DTO Naming Convention

```ts
✅ CORRECT
CreateBuyerDto      (for POST)
UpdateBuyerDto      (for PUT/PATCH)
BuyerQueryParams    (for GET params)
BuyerListResponse   (for API response)

❌ WRONG
BuyerCreate
CreateBuyer         (use Dto suffix)
BuyerUpdate
```

---

## 🔑 React Hook Naming

### Query Keys: Lowercase Plural + Params

```ts
✅ CORRECT
['buyers']                                    // List
['buyers', { status: 'active' }]              // With params
['buyers', buyerId]                           // Single by ID
['buyers', buyerId, 'transactions']           // Nested

❌ WRONG
['buyer']                                     (singular)
['buyersList']                                (camelCase)
['get_buyers']                                (snake_case)
```

### Hook Naming: use + PascalCase Entity

```ts
✅ CORRECT
const useBuyers = () => { }
const useBuyerById = (id: string) => { }
const useCreateBuyer = () => { }
const useUpdateBuyer = () => { }

❌ WRONG
const fetchBuyers = () => { }                 (no use prefix)
const useGetBuyers = () => { }                (no get/fetch prefix)
const usebuyers = () => { }                   (lowercase)
```

---

## 🎨 Component Naming

### UI Components: Describe What It Is

```tsx
✅ CORRECT
BuyerCard          (displays buyer info)
BuyerForm          (form for buyer)
BuyerTable         (table of buyers)
LoadingSpinner     (loading indicator)
ErrorMessage       (error display)
EmptyState         (empty state display)
Modal              (modal dialog)
Button             (button)

❌ WRONG
Card               (too generic)
Form               (too generic)
Table              (too generic)
BuyerCardComponent (redundant suffix)
BuyerCardUI        (redundant suffix)
```

### Feature Components

```tsx
✅ CORRECT
BuyerFilter        (in features/buyer-list/)
CreateBuyerForm    (in features/create-buyer/)
BuyerSearch        (in features/search-buyers/)

❌ WRONG
Filter             (too generic)
BuyerCreateForm    (order matters: CreateBuyer not BuyerCreate)
```

### Widget Components

```tsx
✅ CORRECT
BuyerListWidget    (in widgets/buyer-list-widget/)
HeaderWidget       (in widgets/header/)

❌ WRONG
BuyerList          (could be anywhere)
Header             (could be anywhere)
BuyerListSection   (use Widget suffix, not Section)
```

---

## 📤 Export/Import Naming

### Barrel Exports: Use index.ts

```ts
// entities/buyer/index.ts
export { type Buyer, type CreateBuyerDto } from "./model/types";
export { buyerApi } from "./api/buyerApi";
export { BuyerCard } from "./ui/BuyerCard";

// Then import using path alias:
import { Buyer, buyerApi, BuyerCard } from "@/entities/buyer";
```

### Never Use Default Exports in FSD Layers

```ts
❌ WRONG
export default const buyerApi = { };   // default export

✅ CORRECT
export const buyerApi = { };           // named export
```

---

## 📍 API Endpoint Naming

### REST Convention: Plural Resources

```ts
✅ CORRECT
GET    /buyer              (list all)
GET    /buyer/:id          (get one)
POST   /buyer              (create)
PUT    /buyer/:id          (update)
DELETE /buyer/:id          (delete)

❌ WRONG
GET    /getBuyer           (use REST convention)
GET    /fetch-buyers       (use REST convention)
POST   /createBuyer        (use REST convention)
```

### Query Parameters: Lowercase camelCase

```ts
✅ CORRECT
GET /buyer?status=active&limit=10&offset=0

❌ WRONG
GET /buyer?Status=active
GET /buyer?limit_size=10
GET /buyer?OFFSET=0
```

---

## 🌍 Multilanguage Key Naming

### Translation Keys: PascalCase Namespace + camelCase Key

```json
{
  "BuyersPage": {
    "title": "Buyers",
    "noData": "No buyers found",
    "createButton": "Create Buyer"
  },
  "BuyerForm": {
    "nameLabel": "Buyer Name",
    "submitButton": "Save"
  }
}
```

### Usage in Components

```tsx
const t = useTranslations('BuyersPage');
<h1>{t('title')}</h1>        // ✅ CORRECT

const t = useTranslations('BuyerForm');
<label>{t('nameLabel')}</label>  // ✅ CORRECT

❌ WRONG
<h1>{t('BuyersPage.title')}</h1>  // namespace included in key
<h1>{t('Buyers_Page_Title')}</h1> // wrong format
```

---

## 🔗 CSS Class Naming

Use **BEM (Block Element Modifier)** with kebab-case (or Tailwind utility classes):

```tsx
❌ WRONG (custom CSS)
<div className="buyerCard buyerCard--active buyerCard__header">
  <div className="header__title title--large">...</div>
</div>

✅ CORRECT (Tailwind)
<div className="bg-white rounded-lg shadow">
  <div className="p-4 border-b">
    <h2 className="text-lg font-bold">...</h2>
  </div>
</div>
```

### Custom CSS (if needed)

```css
/* Block */
.buyer-card {
}

/* Element */
.buyer-card__header {
}
.buyer-card__content {
}

/* Modifier */
.buyer-card--active {
}
.buyer-card--disabled {
}
```

---

## ✅ Naming Checklist

- [ ] Folders: kebab-case
- [ ] Components: PascalCase
- [ ] Utilities/Hooks: camelCase with `use` prefix
- [ ] Types/Interfaces: PascalCase
- [ ] DTOs: `[Action][Entity]Dto` (e.g., `CreateBuyerDto`)
- [ ] Query Keys: lowercase plural (e.g., `['buyers']`)
- [ ] API endpoints: REST convention (plural resources)
- [ ] Query params: camelCase lowercase
- [ ] Translation keys: `Namespace.camelCaseKey`
- [ ] No default exports in FSD layers
- [ ] All exports via `index.ts` (barrel)

---

**Last Updated:** 2026-06-18
