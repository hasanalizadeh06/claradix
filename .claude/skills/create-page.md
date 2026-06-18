---
name: create-page
description: Create a new NextJS page with proper structure and metadata
argument-hint: "Page name and optional layout (e.g., 'about' or 'dashboard --layout admin')"
---

# /create-page

Creates a new NextJS page with proper FSD structure, layout, and SEO metadata.

## Usage

```bash
# Simple page
/create-page about

# With layout/section
/create-page dashboard --layout admin

# Nested page
/create-page products/details

# Dynamic page
/create-page products/[id] --dynamic
```

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
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buyers',
  description: 'Manage all buyers in your system',
  openGraph: {
    title: 'Buyers',
    description: 'Manage all buyers in your system',
    type: 'website',
  },
};

export default function BuyersPage() {
  const t = useTranslations('BuyersPage');

  return (
    <main id="main-content" className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-slate-600">{t('description')}</p>
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
import { Skeleton } from '@/shared/ui';

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
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
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
