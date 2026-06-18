# 🚀 Claradix Frontend

Modern, accessible, and high-performance NextJS frontend application with Feature-Sliced Design architecture.

## 🏗️ Technology Stack

- **Framework:** NextJS 14+ (App Router)
- **Architecture:** Feature-Sliced Design (FSD)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **API:** Axios + React Query v5 (7-layer pattern)
- **Multilanguage:** next-intl (Azerbaijani, English, Russian)
- **Testing:** Jest + React Testing Library (100% coverage)
- **Accessibility:** WCAG 2.1 AA + Semantic HTML

## 📖 Documentation

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for complete project documentation.

**Key Rules:**
- [FSD Architecture](.claude/rules/fsd-architecture.md)
- [API Architecture](.claude/rules/api-architecture.md)
- [Naming Conventions](.claude/rules/naming-conventions.md)
- [Semantic HTML & Accessibility](.claude/rules/semantic-html.md)
- [Component Standards](.claude/rules/component-standards.md)
- [TypeScript Rules](.claude/rules/typescript-rules.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🧪 Development

```bash
# Lint & format
npm run lint
npm run format

# Type check
npm run type-check

# Run tests
npm run test
npm run test:coverage

# Full validation before commit
/build-project
```

## 🎯 Custom Commands

```bash
# Create new entity (types + API + hooks + widget)
/create-entity product

# Create new page
/create-page products

# Sync translations across all languages
/sync-translations

# Full build validation
/build-project
```

## 📁 Project Structure

```
src/
├── app/[locale]/          # NextJS pages & routing
├── widgets/               # Complex page sections
├── features/              # User actions & features
├── entities/              # Business logic entities
└── shared/                # Reusable code (UI, API, utils)

.claude/
├── CLAUDE.md             # Complete project guide
├── settings.json         # Configuration
├── rules/                # Project rules (FSD, API, etc.)
└── skills/               # Custom commands
```

## 🔒 Key Principles

1. **FSD Architecture** — Layers: app → widgets → features → entities → shared
2. **7-Layer API Pattern** — Axios → requests → React Query → entity API → hooks → widgets
3. **WCAG 2.1 AA** — Accessible, semantic HTML
4. **100% TypeScript** — Strict mode, no `any`
5. **100% Test Coverage** — Enforced in build
6. **Multilingual** — All text translated (next-intl)

## 🌍 Internationalization

All UI text uses `useTranslations()`:

```tsx
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('ComponentName');
  return <h1>{t('title')}</h1>;
}
```

Supported languages: Azerbaijani (az), English (en), Russian (ru)

## 📊 Quality Standards

- **TypeScript Errors:** 0
- **Lint Violations:** 0
- **Test Coverage:** 100%
- **Accessibility:** WCAG 2.1 AA
- **Bundle Size:** <250KB (gzipped)
- **Lighthouse Score:** 90+

## 🔗 References

- [NextJS Docs](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/)

---

**Built with ❤️ using NextJS, TypeScript, and Claude Code**
