# 🎯 Claradix Frontend Project

**Claradix** — modern, accessible, ve high-performance NextJS frontend uygulaması.

## 📋 Proje Özeti

- **Type:** NextJS 14+ Frontend Application
- **Architecture:** Feature-Sliced Design (FSD)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3+
- **UI Components:** Shadcn/ui + custom components
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **Data Fetching:** Axios + React Query v5 (7-layer API pattern)
- **Multilanguage:** next-intl (Azerbaijani, English, Russian)
- **Testing:** Jest + React Testing Library (100% coverage target)
- **Accessibility:** WCAG 2.1 AA + Semantic HTML
- **Auth:** JWT + httpOnly cookies
- **Code Quality:** ESLint + Prettier

---

## 📁 Proje Yapısı (FSD)

```
claradix-front/
├── src/
│   ├── app/                    # NextJS App Router
│   │   ├── [locale]/           # i18n routing
│   │   ├── layout.tsx          # Root layout + providers
│   │   └── middleware.ts       # Locale detection
│   │
│   ├── widgets/                # Complex page sections
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── [entity-name]-list/
│   │
│   ├── features/               # User actions & features
│   │   ├── [entity-name]/
│   │   │   ├── api/
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── entities/               # Business logic entities
│   │   ├── [entity-name]/
│   │   │   ├── model/types.ts
│   │   │   ├── api/[entity]Api.ts
│   │   │   ├── ui/              (optional)
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── shared/                 # Reusable across layers
│   │   ├── ui/                 # Button, Input, Card, etc.
│   │   ├── api/
│   │   │   ├── client.ts       # Axios client
│   │   │   ├── requests.ts     # Typed wrappers
│   │   │   ├── useApi.ts       # React Query wrappers
│   │   │   └── queryClient.ts  # React Query config
│   │   ├── lib/                # Utilities
│   │   ├── config/             # App configuration
│   │   └── types/              # Global types
│   │
│   ├── messages/               # Translations (i18n)
│   │   ├── az.json
│   │   ├── en.json
│   │   └── ru.json
│   │
│   └── __tests__/              # Integration tests
│
├── .claude/                    # Claude Code configuration
│   ├── CLAUDE.md              # This file
│   ├── settings.json          # Configuration
│   ├── rules/                 # Project rules
│   │   ├── fsd-architecture.md
│   │   ├── api-architecture.md
│   │   ├── naming-conventions.md
│   │   ├── semantic-html.md
│   │   ├── component-standards.md
│   │   ├── typescript-rules.md
│   │   ├── security.md
│   │   └── git-workflow.md
│   └── skills/                # Custom commands
│       ├── create-page.md
│       ├── create-entity.md
│       ├── sync-translations.md
│       ├── build-project.md
│       └── validate-semantic.md
│
├── public/                    # Static assets
│   ├── fonts/
│   └── images/
│
├── .env.example              # Environment template
├── .env.local                # Local env (git ignored)
├── next.config.js            # NextJS config
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── jest.config.js            # Jest testing config
├── package.json
└── README.md

```

---

## 🔐 API Architecture (7-Layer Pattern)

### Layer 1: Axios Client (`shared/api/client.ts`)

- Centralized axios instance
- Base URL, timeout, headers configuration
- Request interceptor: Auto-attach `Authorization: Bearer <token>`
- Response interceptor: Normalize errors to typed `ApiError`
- 401 handling: Refresh token queue pattern

### Layer 2: Typed Request Wrappers (`shared/api/requests.ts`)

```ts
apiGet<T>(url, config?) → Promise<T>
apiPost<T, D>(url, data, config?) → Promise<T>
apiPut<T, D>(url, data, config?) → Promise<T>
apiDelete<T>(url, config?) → Promise<T>
apiPatch<T, D>(url, data, config?) → Promise<T>
```

### Layer 3: React Query Config (`shared/api/queryClient.ts`)

- Global defaults: `staleTime`, `cacheTime`, `retry` (GET only), `refetchOnWindowFocus`
- Error handling: Normalized `ApiError` type
- No auto-retry for POST/PUT/DELETE (idempotency risk)

### Layer 4: React Query Wrappers (`shared/api/useApi.ts`)

```ts
useApiQuery<TData, TError>(keys, queryFn, options?)
useApiMutation<TData, TError, TVariables>(mutationFn, options?)
```

### Layer 5: Entity API (`entities/<entity>/api/<entity>Api.ts`)

```ts
export const buyerApi = {
  getBuyers: () => apiGet<Buyer[]>("/buyer"),
  createBuyer: (data: CreateBuyerDto) =>
    apiPost<Buyer, CreateBuyerDto>("/buyer", data),
};
```

### Layer 6: Feature Hook (`features/<entity>/api/use<Entities>.ts`)

```ts
export const useBuyers = () =>
  useApiQuery<Buyer[], unknown>(["buyers"], buyerApi.getBuyers);
```

### Layer 7: UI Widget (`widgets/<entity>-list/ui/<Entities>List.tsx`)

```tsx
"use client";
import { useBuyers } from "@/features/buyer/api/useBuyers";

export function BuyersWidget() {
  const { data, isLoading, error } = useBuyers();

  if (isLoading) return <Loading />;
  if (error) return <p>{String((error as any)?.message)}</p>;
  if (!data?.length) return <p>{t("Buyers.noData")}</p>;

  return (
    <ul>
      {data.map((b) => (
        <li key={b.id}>{b.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🌍 Multilingual Support (next-intl)

### Setup

- **Routing:** `/[locale]/...` (Azerbaijani `az`, English `en`, Russian `ru`)
- **Message files:** `src/messages/[locale].json`
- **Hook:** `useTranslations(namespace)` in client components

### Usage in Components

```tsx
import { useTranslations } from "next-intl";

export function HomePage() {
  const t = useTranslations("HomePage");
  return <h1>{t("title")}</h1>; // References HomePage.title in message files
}
```

### Translation Key Structure

```json
{
  "HomePage": {
    "title": "Welcome to Claradix",
    "description": "Modern, accessible frontend",
    "features": {
      "fast": "Fast",
      "secure": "Secure",
      "accessible": "Accessible"
    }
  }
}
```

### Adding New Strings

Use the `/sync-translations` skill:

```bash
/sync-translations
# Scans for missing keys across all language files
# Adds missing keys to incomplete language files
# Keeps JSON structure consistent
```

### Single-to-Multilanguage Conversion (4-Step Process)

When converting existing page to multilingual:

**Step 1: Project Support Check**

```bash
✅ Verify:
  - ./messages/ directory exists (az.json, en.json, ru.json)
  - next-intl package installed
  - i18n config present
```

**Step 2: File Analysis**

- Identify all hardcoded text strings in `.tsx` file
- Note HTML content that needs `dangerouslySetInnerHTML`
- List all user-facing text

**Step 3: Update Translation Files**

```json
// messages/az.json
{
  "PageName": {
    "title": "Azərbaycanca başlıq",
    "description": "Azərbaycanca təsvir"
  }
}

// messages/en.json
{
  "PageName": {
    "title": "English Title",
    "description": "English Description"
  }
}

// messages/ru.json
{
  "PageName": {
    "title": "Русский заголовок",
    "description": "Русское описание"
  }
}
```

**Step 4: Transform TSX File**

```tsx
"use client";
import { useTranslations } from "next-intl";

export function Page() {
  const t = useTranslations("PageName");

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>

      {/* For HTML content, use dangerouslySetInnerHTML + t.raw() */}
      <div dangerouslySetInnerHTML={{ __html: t.raw("richContent") }} />
    </main>
  );
}
```

### HTML Content in Translations

```json
{
  "PageName": {
    "richContent": "<strong>Bold text</strong> and <em>emphasized</em>"
  }
}
```

```tsx
// Use t.raw() + dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: t.raw('richContent') }} />

// NOT this:
<div>{t('richContent')}</div>  // ❌ Would render HTML as text
```

### next-intl API Methods

```tsx
const t = useTranslations("Namespace");

// Simple translation
t("key");

// With interpolation
t("message", { name: "John" }); // "Hello {name}" → "Hello John"

// Raw HTML (needs dangerouslySetInnerHTML)
t.raw("richKey");

// Rich components
t.rich("formatted", {
  bold: (chunks) => <strong>{chunks}</strong>,
});

// Default value
t("nonexistent", "default text");
```

### Missing Key Handling

Add placeholder to `messages/[locale].json` when key is missing:

```json
{
  "Namespace": {
    "missingKey": "TRANSLATE_ME"
  }
}
```

Always sync after adding new strings:

```bash
/sync-translations
```

---

## 🧪 Testing Strategy

### Unit Tests (entities, shared/lib)

```bash
npm run test -- src/shared/lib
npm run test -- src/entities
```

### Integration Tests (hooks, API calls)

```bash
npm run test -- src/features
```

### Component Tests (UI components)

```bash
npm run test -- src/shared/ui
```

### Coverage Target

- **Minimum:** 100% (enforced on build)
- **Run coverage:** `npm run test:coverage`

---

## 🔒 Security & Performance Checklist

### API Layer

- ✅ No direct `axios` calls outside `client.ts`
- ✅ No direct `apiClient.get/post` outside `requests.ts`
- ✅ No raw `useQuery/useMutation` outside `useApi.ts`
- ✅ Token stored in httpOnly cookies (not localStorage)
- ✅ Refresh token queue pattern for 401 handling
- ✅ All POST/PUT/DELETE require explicit error handling
- ✅ No auto-retry for non-idempotent operations

### Accessibility (WCAG 2.1 AA)

- ✅ Semantic HTML (button, nav, main, article, section, footer)
- ✅ All images have `alt` attributes
- ✅ All interactive elements keyboard accessible
- ✅ 44×44px minimum touch targets (mobile)
- ✅ ARIA attributes properly used
- ✅ Skip navigation links present
- ✅ Form labels with `<label htmlFor>`
- ✅ No hardcoded colors (use CSS variables/Tailwind tokens)

### Performance

- ✅ Next Image: `loading="lazy"`, `decoding="async"`, `width/height`
- ✅ Code splitting by route
- ✅ Lazy load components with `dynamic()`
- ✅ Font optimization with `next/font`
- ✅ Bundle analysis: `ANALYZE=true npm run build`

---

## 🎨 Design System

### Colors

- **Primary:** `bg-blue-600` (`#2563eb`)
- **Secondary:** `bg-slate-600` (`#475569`)
- **Success:** `bg-green-600` (`#16a34a`)
- **Warning:** `bg-yellow-600` (`#ca8a04`)
- **Error:** `bg-red-600` (`#dc2626`)
- **Background:** `bg-white` / `dark:bg-slate-900`
- **Text:** `text-slate-900` / `dark:text-white`

### Typography

```tsx
<h1 className="text-4xl font-bold">Page Title</h1>
<h2 className="text-3xl font-bold">Section</h2>
<h3 className="text-2xl font-semibold">Subsection</h3>
<p className="text-base leading-relaxed">Body text</p>
<small className="text-sm text-slate-600">Helper text</small>
```

### Spacing

- `4px` (px-1): `p-1`, `m-1`, `gap-1`
- `8px` (px-2): `p-2`, `m-2`, `gap-2`
- `16px` (px-4): `p-4`, `m-4`, `gap-4`
- `24px` (px-6): `p-6`, `m-6`, `gap-6`
- `32px` (px-8): `p-8`, `m-8`, `gap-8`

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Production preview
npm run start

# Linting & formatting
npm run lint
npm run format

# Testing
npm run test              # Watch mode
npm run test:coverage     # Coverage report

# Type checking
npm run type-check

# Full validation (build project)
/build-project
```

---

## 🔄 Development Workflow (5 Phases)

Every task follows this structured workflow:

### Phase 1: Analysis

1. Read `.claude/CLAUDE.md` for project context
2. Identify which FSD layers are affected
3. Check relevant rule files for requirements
4. Plan file structure and changes

### Phase 2: Request Approval

1. Explain changes clearly and concisely
2. List all files to be modified/created with reasons
3. Request explicit user approval before proceeding
4. Allow revisions to the plan if needed

### Phase 3: Implementation

1. Apply changes following **all project rules**
2. Update `index.ts` exports in affected layers
3. Add translation keys if new UI text is introduced
4. Run `/build-project` validation immediately after

### Phase 4: Validation

1. ✅ Type checking passes (`npm run type-check`)
2. ✅ Tests pass with 100% coverage
3. ✅ Linting passes (`npm run lint`)
4. ✅ Build succeeds (`npm run build`)
5. ✅ No console warnings or errors

### Phase 5: Reporting

1. Summarize all changes made
2. List files modified and why
3. Report code quality metrics
4. Show validation results
5. Confirm ready for commit/deployment

---

## ⚠️ Key Principles for Every Change

- **No direct axios** → Use layer-based pattern (client → requests → entity API → hooks → widgets)
- **No raw useQuery** → Always use `useApiQuery`/`useApiMutation` wrappers
- **All text translated** → No hardcoded text; use `useTranslations()`
- **Semantic HTML** → Native elements first; ARIA only when needed
- **Type safety** → No `any` type; all parameters/returns typed
- **Accessibility** → WCAG 2.1 AA minimum; 44×44px touch targets
- **Tests first** → 100% coverage enforced in build
- **Layer rules** → Correct placement + import directions strictly enforced

---

## 📚 Important Rules

### FSD Architecture

- ✅ Correct layer placement for every file
- ✅ Import direction rules strictly enforced
- ✅ Circular dependencies forbidden
- ✅ Every layer has `index.ts` public API

### Naming Conventions

- **Folders:** kebab-case (`buyer-list`, `user-profile`)
- **Files:** PascalCase (components), camelCase (utils)
- **Components:** PascalCase (`BuyerList`, `UserCard`)
- **Hooks:** camelCase with `use` prefix (`useBuyers`, `useForm`)
- **Query keys:** `['entityPlural', params?]` (`['buyers']`, `['buyers', {status: 'active'}]`)

### Semantic HTML

- ✅ Use native elements: `<button>`, `<a>`, `<nav>`, `<main>`
- ✅ ARIA only when needed
- ✅ All images: `alt=""` (even decorative: `alt=""`)
- ✅ Forms: `<label htmlFor>`, `aria-required`, `aria-invalid`
- ✅ Landmarks: `<header role="banner">`, `<main id="main-content">`, `<footer>`

### TypeScript

- ✅ Strict mode enabled
- ✅ No `any` type
- ✅ Proper error types (ApiError, ValidationError)
- ✅ Generic types properly constrained

### Git Workflow

- ✅ Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
- ✅ Feature branches: `feature/entity-name`
- ✅ All tests pass before commit
- ✅ No force-push to main/master

---

## 🚀 Custom Skills

### `/create-page`

Creates a new NextJS page with proper structure:

```bash
/create-page --name about --layout marketing
```

Generates: `src/app/[locale]/about/page.tsx` + metadata

### `/create-entity`

Creates a complete entity (types, API, hooks, widget):

```bash
/create-entity --name buyer
```

Generates all 5 files + translations

### `/sync-translations`

Synchronizes translation keys across all language files:

```bash
/sync-translations
```

Ensures `az.json`, `en.json`, `ru.json` have identical structure

### `/build-project`

Full validation pipeline:

```bash
/build-project
```

Runs: Prettier → ESLint → Type check → Tests → Build

### `/validate-semantic`

Checks semantic HTML compliance:

```bash
/validate-semantic
```

Verifies WCAG 2.1 AA compliance in components

---

## 📝 Key Files Reference

| File                          | Purpose                        |
| ----------------------------- | ------------------------------ |
| `src/app/[locale]/layout.tsx` | Root layout + providers        |
| `src/app/middleware.ts`       | Locale detection               |
| `src/shared/api/client.ts`    | Axios client configuration     |
| `src/shared/api/requests.ts`  | Typed request wrappers         |
| `src/shared/api/useApi.ts`    | React Query wrappers           |
| `.env.example`                | Environment variables template |
| `next.config.js`              | NextJS configuration           |
| `tailwind.config.ts`          | Tailwind design system         |
| `jest.config.js`              | Testing configuration          |

---

## ⚡ Performance Targets

- **Lighthouse Score:** 90+ (all metrics)
- **Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Size:** <200KB (gzipped, including React + React Query)
- **Time to Interactive:** <3s (on 4G)

---

## 🔗 External References

- [NextJS Documentation](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [Semantic HTML](https://html.spec.whatwg.org/multipage/semantics.html)
- [next-intl Documentation](https://next-intl-docs.vercel.app)

---

**Last Updated:** 2026-06-18
**Created by:** Claude Code + Claradix Team
