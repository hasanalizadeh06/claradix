# ♿ Semantic HTML & Accessibility (WCAG 2.1 AA)

**Reference:** Detailed rules in `SEMANTIC_HTML_AGENT_RULES.md`

---

## 🔑 Core Principles

1. **Native HTML semantics > ARIA**
   - Use `<button>`, not `<div role="button">`
   - Use `<a>`, not `<div onClick>`
   - Use `<nav>`, not `<div role="navigation">`

2. **Accessibility First**
   - All interactive elements keyboard accessible
   - All UI readable by screen readers
   - WCAG 2.1 AA minimum standard

3. **One h1 per page, proper hierarchy**
   - `h1 → h2 → h3` (no skipping levels)
   - Only one `<h1>` per page
   - All text uses `useTranslations()`

---

## 📄 HTML Structure

### Required Landmarks

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function Layout({ children }) {
  const t = useTranslations('Layout');

  return (
    <html lang="en" dir="ltr">
      <head>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Skip link */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          {t('skipToContent')}
        </a>

        {/* Page header */}
        <header role="banner" aria-label={t('headerLabel')}>
          <nav aria-label={t('mainNav')}>{/* ... */}</nav>
        </header>

        {/* Main content */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        {/* Page footer */}
        <footer role="contentinfo" aria-label={t('footerLabel')}>
          {/* ... */}
        </footer>
      </body>
    </html>
  );
}
```

---

## 🔘 Interactive Elements

### Buttons

```tsx
✅ CORRECT
<button type="button" onClick={handleClick}>
  {t('clickMe')}
</button>

<button type="submit">
  {t('submit')}
</button>

<button
  type="button"
  aria-label={t('closeMenu')}
  aria-expanded={isOpen}
  aria-controls="menu"
>
  ☰
</button>

❌ WRONG
<div onClick={handleClick}>{t('clickMe')}</div>
<button>{t('clickMe')}</button>  (no type attr)
<button aria-label="button">...</button>  (redundant label)
```

### Links

```tsx
✅ CORRECT
<a href="/about">{t('aboutLink')}</a>

<a
  href="https://external.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label={t('externalLink', { name: 'Example' })}
>
  {t('visitExample')}
</a>

❌ WRONG
<a href="javascript:void(0)">...</a>
<a href="/page" onClick={handleClick}>...</a>
<a href="#" onClick={...}>...</a>
```

---

## 📝 Forms

### Labels & Inputs

```tsx
✅ CORRECT
<label htmlFor="email">
  {t('emailLabel')}
  {required && <span aria-label="required">*</span>}
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
  {...register('email')}
/>
{error && (
  <span id="email-error" role="alert" className="text-red-600">
    {error.message}
  </span>
)}

❌ WRONG
<input placeholder={t('emailLabel')} />  (placeholder is not label)
<input {...register('email')} />  (no label)
<label>{t('emailLabel')}<input /></label>  (implicit, but explicit is better)
```

### Form Structure

```tsx
✅ CORRECT
<form action="/submit" method="post" noValidate>
  <fieldset>
    <legend>{t('personalInfo')}</legend>
    {/* Form fields */}
  </fieldset>
</form>

❌ WRONG
<form>
  <div>{t('personalInfo')}</div>  (no fieldset/legend)
</form>
```

---

## 🖼️ Images

### Image Requirements

```tsx
✅ CORRECT (Informative)
<img
  src="buyer.jpg"
  alt={t('buyerImage', { name: 'John Doe' })}  // Descriptive alt
  width={200}
  height={200}
  loading="lazy"
  decoding="async"
/>

✅ CORRECT (Decorative)
<img
  src="divider.svg"
  alt=""  // Empty but present
  width={800}
  height={4}
  aria-hidden="true"
/>

✅ CORRECT (Responsive)
<picture>
  <source srcSet="/hero-sm.webp 480w, /hero-lg.webp 1280w" type="image/webp" />
  <img
    src="/hero-lg.jpg"
    alt={t('heroImage')}
    width={1280}
    height={640}
    loading="eager"
    fetchPriority="high"
  />
</picture>

❌ WRONG
<img src="photo.jpg" />  (no alt)
<img src="photo.jpg" alt="image" />  (unhelpful alt)
<img src="photo.jpg" alt="" />  (informative image with empty alt)
```

---

## 🎥 Video & Audio

### Video with Captions

```tsx
✅ CORRECT
<video
  controls
  preload="metadata"
  width={800}
  height={450}
  aria-label={t('lessonVideo')}
>
  <source src="/lesson.webm" type="video/webm; codecs=vp9,opus" />
  <source src="/lesson.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/captions/lesson-az.vtt"
    srclang="az"
    label={t('azerbaijani')}
    default
  />
  <p>{t('videoNotSupported')}</p>
</video>

❌ WRONG
<video autoplay>...</video>  (no controls)
<video>...</video>  (no captions)
<video muted loop>...</video>  (background video without muted/loop)
```

---

## 🎨 Lists & Tables

### Lists

```tsx
✅ CORRECT
<ul role="list" aria-label={t('features')}>
  <li>{t('feature1')}</li>
  <li>{t('feature2')}</li>
</ul>

<ol aria-label={t('steps')}>
  <li>{t('step1')}</li>
  <li>{t('step2')}</li>
</ol>

❌ WRONG
<ul style={{listStyle: 'none'}}>  (missing role="list")
<div>{t('feature1')}</div>  (not a list)
```

### Tables

```tsx
✅ CORRECT
<table aria-describedby="table-note">
  <caption>{t('salesData')}</caption>
  <thead>
    <tr>
      <th scope="col">{t('month')}</th>
      <th scope="col">{t('sales')}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{t('january')}</td>
      <td>$50,000</td>
    </tr>
  </tbody>
</table>

❌ WRONG
<table><tr><td>...</td></tr></table>  (no headers)
<table>heading</table>  (no <caption>)
<table><tr><td scope="col">...</td></tr></table>  (scope on td)
```

---

## 🎭 Accessibility Attributes

### ARIA Attributes

```tsx
// aria-label: Direct labeling
<button aria-label={t('closeButton')}>✕</button>

// aria-labelledby: Reference another element
<section aria-labelledby="section-title">
  <h2 id="section-title">{t('sectionTitle')}</h2>
</section>

// aria-describedby: Provide extra description
<input aria-describedby="password-hint" />
<span id="password-hint">{t('passwordRequirements')}</span>

// aria-expanded: Toggle state
<button aria-expanded={isOpen} aria-controls="menu">
  {t('menu')}
</button>

// aria-live: Dynamic content updates
<div aria-live="polite" aria-atomic="true">
  {t('searchResults', { count: results.length })}
</div>
```

---

## 📱 Mobile Accessibility

```tsx
✅ CORRECT
<button className="w-12 h-12">  {/* 48×48px = 3×3 rem */}
  {t('action')}
</button>

<input
  type="email"
  inputMode="email"  {/* Mobile keyboard */}
  autoComplete="email"  {/* Form filling */}
/>

❌ WRONG
<button className="w-6 h-6">  {/* Too small for touch */}
  {t('action')}
</button>

<input type="text" inputMode="numeric" />  {/* Should be type="number" */}
```

---

## ✅ Accessibility Checklist

- [ ] `<html lang="...">`
- [ ] Only one `<h1>` per page
- [ ] Heading hierarchy: h1→h2→h3 (no skips)
- [ ] All images have descriptive `alt=""`
- [ ] All images have `width/height`
- [ ] All buttons have `type` attribute
- [ ] All inputs have associated `<label>`
- [ ] All form fields have `aria-required` if required
- [ ] All interactive elements keyboard accessible
- [ ] Skip navigation link present
- [ ] Page landmarks: header, nav, main, footer
- [ ] Video has captions/tracks
- [ ] Audio has transcripts
- [ ] No hardcoded colors (use design tokens)
- [ ] Touch targets ≥44×44px
- [ ] All text uses `useTranslations()`
- [ ] No `placeholder` used as label

---

**Related:** `SEMANTIC_HTML_AGENT_RULES.md` (comprehensive reference)

**Last Updated:** 2026-06-18
