---
name: create-page
description: Create a new NextJS page with proper structure, metadata, and business logic
argument-hint: "Page name + business context (e.g., 'login users login but admins are blocked')"
---

# /create-page

Creates a new NextJS page with proper FSD structure, metadata, and security.

## Format

```bash
/create-page [page-name] [business-context]
```

**[page-name]:** Single word or path, kebab-case (login, dashboard, products, user-profile)
**[business-context]:** Business rules, access control, features, data needs

## Usage Examples

✅ **Full (with context):**

```bash
/create-page login users can login here, admins are blocked from this page
/create-page dashboard only authenticated users see this, shows user statistics
/create-page products display all products, users see only their own, admins see all
/create-page orders-detail view single order details, only owner or admin can view
```

❌ **Incomplete (missing context):**

```bash
/create-page dashboard
↓
Me: I need more info!

✓ Page name? → dashboard
✓ Business context? → only authenticated users, shows stats
```

✅ **Minimal (just name, I'll ask):**

```bash
/create-page settings
↓
Me: What's the business context?
→ Answer: users edit their profile, admins can edit any user
```

## If Arguments Are Missing

**You run:** `/create-page` (incomplete)

**I immediately ask:**

```
✓ Page name? (single word or path: login, dashboard, products/detail)
  → Your answer: login

✓ Business context? (what do users do here? who can access? key features?)
  → Your answer: users login here, admins cannot access, password reset link needed
```

Once provided, I proceed with detailed questions.

---

## Questions I Will Ask

After you provide page name + context, I will ask:

**Access Control & Authentication:**

- [ ] Who can access this page? (public? authenticated? admin-only? role-based?)
- [ ] How do we check authorization? (role field? permissions array? token claim?)
- [ ] What happens if unauthorized? (redirect to login? show 403? blank page?)
- [ ] Do we need role-based data filtering? (users see own data, admins see all?)
- [ ] Is this a protected route? (auth required in middleware?)

**Data & API:**

- [ ] What data does this page need? (on page load?)
- [ ] Which endpoint(s)? (/api/v1/[resource]?)
- [ ] Should data load immediately or on user action?
- [ ] Do we cache this data? (how long? invalidate when?)
- [ ] How much data? (pagination? infinite scroll? all at once?)
- [ ] Real-time updates needed? (websocket? polling?)

**UI & Components:**

- [ ] What layout? (sidebar? header? full-width?)
- [ ] Main sections? (list view? detail view? form? tabs?)
- [ ] What widgets/components are needed?
- [ ] Search/filter functionality?
- [ ] Bulk actions? (delete multiple? export?)

**States & UX:**

- [ ] Loading state appearance? (skeleton? spinner? placeholder?)
- [ ] Empty state? (when no data, what message?)
- [ ] Error state? (failed to load, how to recover?)
- [ ] Success/feedback messages? (form submitted? item deleted?)
- [ ] Confirmation dialogs? (delete confirmation? leave unsaved changes?)

**Forms & Input (if applicable):**

- [ ] Form fields? (input types, validation?)
- [ ] Required vs optional fields?
- [ ] Form submission? (create? update? delete?)
- [ ] Client-side validation? (real-time or on submit?)
- [ ] Error display? (field-level? form-level?)

**Performance & Special Features:**

- [ ] Need pagination? (page size? server-side or client-side?)
- [ ] Search/autocomplete? (debounced? dropdown? modal?)
- [ ] Sorting capability? (by which columns?)
- [ ] Filtering? (by what criteria?)
- [ ] Export/download? (CSV? PDF?)
- [ ] Print support?
- [ ] Mobile responsive? (changes on mobile?)

**i18n & Localization:**

- [ ] All labels/buttons translated?
- [ ] Error messages translated?
- [ ] Date/number formatting by locale?
- [ ] RTL support needed?

**SEO & Metadata:**

- [ ] Dynamic page title? (based on data?)
- [ ] Meta description? (indexed by search?)
- [ ] Open Graph tags? (for sharing?)
- [ ] Schema markup? (structured data?)

---

## What It Creates

For a page named `buyers`:

```
src/app/[locale]/buyers/
├── page.tsx              # Page component
├── layout.tsx            (optional: for nested layout)
└── loading.tsx           (optional: loading skeleton)

src/widgets/
├── buyers-header/        (if specified)
│   ├── ui/BuyersHeader.tsx
│   └── index.ts
└── buyers-filter/        (if specified)
└── ...

src/messages/[locale].json
  ↓ Added BuyersPage namespace for translations
```

## Generated Code

### page.tsx

```tsx
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyers",
  description: "Manage all buyers in your system",
  openGraph: {
    title: "Buyers",
    description: "Manage all buyers in your system",
    type: "website",
  },
};

export default function BuyersPage() {
  const t = useTranslations("BuyersPage");

  return (
    <main id="main-content" className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-slate-600">{t("description")}</p>
      </header>

      {/* Page content goes here */}
    </main>
  );
}
```

### layout.tsx (if nested)

```tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-slate-100 min-h-screen p-4">
        {/* Admin sidebar */}
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### loading.tsx (optional)

```tsx
import { Skeleton } from "@/shared/ui";

export default function LoadingPage() {
  return (
    <main className="container mx-auto py-8">
      <Skeleton className="h-10 w-48 mb-8" />
      <Skeleton className="h-96" />
    </main>
  );
}
```

## Translation Namespace Added

Automatically adds to all `messages/[locale].json`:

```json
{
  "BuyersPage": {
    "title": "TRANSLATE_ME",
    "description": "TRANSLATE_ME"
  }
}
```

## Dynamic Routes

For dynamic pages like `/products/[id]`:

```tsx
// src/app/[locale]/products/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  // Fetch product and generate dynamic metadata
  const product = await fetch(`/api/products/${params.id}`);
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetch(`/api/products/${params.id}`);

  if (!product) notFound();

  return (
    <main>
      <h1>{product.name}</h1>
      {/* Content */}
    </main>
  );
}
```

## SEO Best Practices Applied

✅ **Metadata:**

- Unique `title` and `description`
- Open Graph tags
- Canonical URL
- Proper lang attribute

✅ **Semantic HTML:**

- Single `<h1>` per page
- Proper heading hierarchy
- Skip navigation link
- Landmark elements

✅ **Accessibility:**

- `id="main-content"` for focus management
- `tabIndex={-1}` on main
- ARIA labels where needed
- Keyboard navigation support

✅ **Performance:**

- Code splitting by route
- Lazy loading components
- Metadata streaming
- Static generation when possible

## File Organization

```
src/app/[locale]/
├── layout.tsx              (Root layout)
├── page.tsx                (Home page)
├── buyers/
│   ├── page.tsx            (Buyers list)
│   ├── [id]/
│   │   └── page.tsx        (Buyer detail)
│   └── new/
│       └── page.tsx        (Create buyer)
├── products/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── not-found.tsx           (Custom 404)
├── error.tsx               (Error boundary)
└── (auth)/                 (Route group)
    ├── login/
    └── signup/
```

## Notes

- Pages automatically use the `[locale]` routing
- Metadata must use `generateMetadata()` for dynamic content
- All text must use `useTranslations()`
- Use widgets for complex page sections
- Use features for reusable functionality

## Next Steps After Creation

1. Add page content using widgets
2. Translate the BuyersPage namespace
3. Add to main navigation if needed
4. Run `/build-project` to validate

## Examples

```bash
# Admin dashboard with sidebar
/create-page dashboard --layout admin

# Product detail with dynamic ID
/create-page products/[id] --dynamic

# Settings page grouped with auth
/create-page settings --group account

# Blog post with metadata
/create-page blog/[slug] --dynamic --blog
```
