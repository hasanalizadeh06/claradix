# ♿ Semantic HTML & Accessibility (WCAG 2.1 AA)

**Standard:** WCAG 2.1 Level AA compliance required for all pages.

---

## 🔑 Core Principles (CRITICAL)

### 1. **Native HTML semantics > ARIA**

ALWAYS use native elements first. ARIA is a fallback only.

```tsx
✅ CORRECT
<button type="button" onClick={handler}>Click me</button>
<a href="/page">Link</a>
<nav aria-label="Main navigation">...</nav>
<main id="main-content">...</main>
<header role="banner">...</header>
<article aria-labelledby="title">...</article>
<table><caption>...</caption>...</table>

❌ WRONG
<div role="button" onClick={handler}>Click me</div>
<div role="link" onClick={navigateTo}>Link</div>
<div role="navigation">...</div>
<div role="main">...</div>
<div role="banner">...</div>
```

### 2. **Keyboard Accessibility**

ALL interactive elements must work with keyboard:

- **Tab** — Navigate forward
- **Shift+Tab** — Navigate backward
- **Enter/Space** — Activate button
- **Arrow keys** — Navigate lists/menus
- **Escape** — Close dialogs/dropdowns

### 3. **Screen Reader Friendly**

- All text has semantic meaning
- Links have descriptive text (not "click here")
- Images have alt text
- Form inputs have labels
- Landmarks help navigation

### 4. **WCAG 2.1 AA Requirements**

- **1.1.1 Non-text Content** — All images have alt text
- **1.4.3 Contrast** — Text contrast ≥4.5:1 (normal), ≥3:1 (large)
- **2.1.1 Keyboard** — All functionality keyboard accessible
- **2.4.1 Bypass Blocks** — Skip navigation links
- **2.5.5 Target Size** — Click targets ≥44×44px
- **3.2.4 Consistent Identification** — Same component = same naming
- **3.3.1 Error Identification** — Form errors clearly identified
- **3.3.2 Labels or Instructions** — Form inputs have labels
- **4.1.3 Status Messages** — Dynamic content announced to screen readers

---

## 📄 HTML Structure

### Required Landmarks

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function Layout({ children }) {
  const t = useTranslations("Layout");

  return (
    <html lang="en" dir="ltr">
      <head>
        <title>{t("pageTitle")}</title>
        <meta name="description" content={t("pageDescription")} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Skip link */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          {t("skipToContent")}
        </a>

        {/* Page header */}
        <header role="banner" aria-label={t("headerLabel")}>
          <nav aria-label={t("mainNav")}>{/* ... */}</nav>
        </header>

        {/* Main content */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        {/* Page footer */}
        <footer role="contentinfo" aria-label={t("footerLabel")}>
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

## 🎭 Advanced ARIA Attributes

### aria-label & aria-labelledby

```tsx
// aria-label: Direct labeling (last resort)
<button aria-label="Close menu">✕</button>
<img src="logo.svg" alt="Company Logo" />

// aria-labelledby: Reference another element (preferred)
<section aria-labelledby="section-heading">
  <h2 id="section-heading">Heading</h2>
</section>
```

### aria-describedby

```tsx
// Additional description
<input aria-describedby="password-hint" />
<span id="password-hint">Min 8 chars, 1 number, 1 special char</span>

// Error message
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email format</span>
```

### aria-expanded & aria-controls

```tsx
// Dropdown/accordion
<button
  aria-expanded={isOpen}
  aria-controls="menu"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu
</button>
<ul id="menu" hidden={!isOpen}>
  {/* items */}
</ul>
```

### aria-current

```tsx
// Navigation active state
<a href="/buyers" aria-current="page">Buyers</a>
<a href="/products">Products</a>

// Breadcrumb
<li><span aria-current="location">Current Page</span></li>
```

### aria-live & aria-atomic

```tsx
// Status updates (polite)
<div aria-live="polite" aria-atomic="true">
  {count} items selected
</div>

// Errors (assertive - only for critical)
<div aria-live="assertive" role="alert">
  Payment failed. Try again.
</div>
```

---

## 📋 Form Accessibility (Detailed)

### Fieldset & Legend

```tsx
<fieldset>
  <legend>Personal Information</legend>
  {/* Multiple related inputs */}
</fieldset>

<fieldset>
  <legend>Delivery Method</legend>
  <label><input type="radio" name="method" /> Standard</label>
  <label><input type="radio" name="method" /> Express</label>
</fieldset>
```

### Input Types & Accessibility

```tsx
// Email
<label for="email">Email</label>
<input
  id="email"
  type="email"
  inputMode="email"
  autoComplete="email"
  required
  aria-required="true"
/>

// Telephone
<label for="tel">Phone Number</label>
<input
  id="tel"
  type="tel"
  inputMode="tel"
  autoComplete="tel"
  pattern="[0-9]{10}"
/>

// Date
<label for="dob">Date of Birth</label>
<input
  id="dob"
  type="date"
  min="1900-01-01"
  max="2006-12-31"
  autoComplete="bday"
/>
```

### Error Handling

```tsx
<div role="alert" aria-live="polite">
  {errors.email?.message && (
    <p id="email-error">{errors.email.message}</p>
  )}
</div>

<input
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
```

---

## 🎥 Video & Audio Accessibility

### Video

```tsx
<video
  controls
  preload="metadata"
  width={800}
  height={450}
  aria-label="Tutorial: How to use Claradix"
>
  <source src="/video.webm" type="video/webm; codecs=vp9,opus" />
  <source src="/video.mp4" type="video/mp4" />

  {/* Captions (required for WCAG AA) */}
  <track
    kind="captions"
    src="/captions.vtt"
    srclang="en"
    label="English"
    default
  />

  {/* Descriptions for blind users (WCAG AAA) */}
  <track kind="descriptions" src="/descriptions.vtt" srclang="en" />

  <p>Your browser doesn't support HTML5 video.</p>
</video>
```

### Audio

```tsx
<audio controls preload="none" aria-label="Podcast Episode 1">
  <source src="/podcast.ogg" type="audio/ogg; codecs=vorbis" />
  <source src="/podcast.mp3" type="audio/mpeg" />
  <p>
    <a href="/podcast.mp3">Download audio</a>
  </p>
</audio>
```

---

## 📊 Table Accessibility

### Proper Table Structure

```tsx
<table aria-label="Monthly Sales Data">
  <caption>Sales Performance 2024</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Growth %</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$50,000</td>
      <td>+5%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$600,000</td>
      <td>+12%</td>
    </tr>
  </tfoot>
</table>
```

### Complex Tables with Headers

```tsx
<table>
  <tr>
    <th id="name">Name</th>
    <th id="email">Email</th>
  </tr>
  <tr>
    <td headers="name">John Doe</td>
    <td headers="email">john@example.com</td>
  </tr>
</table>
```

---

## 🎨 Lists & Navigation

### Ordered Lists

```tsx
<ol aria-label="Installation Steps">
  <li>Download the package</li>
  <li>Extract files</li>
  <li>Run installer</li>
</ol>
```

### Unordered Lists

```tsx
<ul role="list" aria-label="Features">
  <li>Fast</li>
  <li>Secure</li>
  <li>Accessible</li>
</ul>
```

### Navigation Menu

```tsx
<nav aria-label="Main Navigation">
  <ul role="list">
    <li>
      <a href="/" aria-current="page">
        Home
      </a>
    </li>
    <li>
      <a href="/about">About</a>
    </li>
    <li>
      <a href="/contact">Contact</a>
    </li>
  </ul>
</nav>
```

---

## 📱 Mobile & Touch Accessibility

### Minimum Touch Targets

```tsx
// ✅ CORRECT: 48×48px (or 44×44px minimum)
<button className="w-12 h-12">  {/* 48px */}
  {t('action')}
</button>

// Spacing between targets
<div className="flex gap-3">  {/* 12px gap */}
  <button className="w-12 h-12">Action 1</button>
  <button className="w-12 h-12">Action 2</button>
</div>

// ❌ WRONG: Too small
<button className="w-6 h-6">  {/* 24px - too small */}
  {t('action')}
</button>
```

### Input Modes (Mobile Keyboards)

```tsx
<input type="email" inputMode="email" />      // Email keyboard
<input type="tel" inputMode="tel" />          // Phone keyboard
<input type="number" inputMode="numeric" />   // Numeric keyboard
<input type="search" inputMode="search" />    // Search keyboard
<input type="url" inputMode="url" />          // URL keyboard
```

---

## 🎭 Interactive Components

### Modals & Dialogs

```tsx
<dialog id="confirm" aria-labelledby="title" aria-modal="true">
  <h2 id="title">Confirm Action</h2>
  <p>Are you sure?</p>
  <button onClick={() => dialog.close('yes')}>Yes</button>
  <button onClick={() => dialog.close('no')}>No</button>
</dialog>

<button onClick={() => document.getElementById('confirm').showModal()}>
  Delete
</button>
```

### Dropdown/Combobox

```tsx
<div className="relative">
  <button
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="options"
    onClick={toggleOpen}
  >
    {selected || "Choose option"}
  </button>
  <ul id="options" role="listbox" hidden={!isOpen} aria-label="Options">
    {items.map((item) => (
      <li
        key={item.id}
        role="option"
        aria-selected={item.id === selectedId}
        onClick={() => selectItem(item)}
      >
        {item.label}
      </li>
    ))}
  </ul>
</div>
```

### Tabs

```tsx
<div role="tablist" aria-label="Content tabs">
  <button
    role="tab"
    aria-selected={activeTab === 'tab1'}
    aria-controls="panel1"
    onClick={() => setActiveTab('tab1')}
  >
    Tab 1
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'tab2'}
    aria-controls="panel2"
    onClick={() => setActiveTab('tab2')}
  >
    Tab 2
  </button>
</div>

<div id="panel1" role="tabpanel" hidden={activeTab !== 'tab1'}>
  {/* Content */}
</div>
<div id="panel2" role="tabpanel" hidden={activeTab !== 'tab2'}>
  {/* Content */}
</div>
```

---

## 🚫 Common Mistakes & Fixes

| Mistake                           | Problem                                      | Fix                                       |
| --------------------------------- | -------------------------------------------- | ----------------------------------------- |
| `<img>` without `alt`             | WCAG violation, confusing for screen readers | Add descriptive `alt=""`                  |
| `placeholder` as label            | Disappears on focus, accessibility issue     | Use `<label>`                             |
| Multiple `<h1>`                   | Screen reader confusion                      | One `<h1>` per page only                  |
| `<div role="button">`             | No keyboard support, click events fail       | Use `<button type="button">`              |
| `<a href="javascript:void(0)">`   | Keyboard navigation broken                   | Use proper href or `<button>`             |
| No `<label>` for input            | Cannot click label to focus input            | `<label htmlFor="id">`                    |
| `aria-label` without visible text | Confusing for sighted users                  | Use visible label, aria-label is fallback |
| `display: none` + `aria-hidden`   | Redundant                                    | Use one or other, not both                |
| Color-only distinction            | Colorblind users can't distinguish           | Add icons, patterns, text                 |
| Auto-playing video/audio          | WCAG 1.4.2 violation                         | Require user interaction                  |

---

## ✅ Complete Accessibility Checklist

### HTML Structure

- [ ] `<!DOCTYPE html>` present
- [ ] `<html lang="...">`set correctly
- [ ] `<meta charset="UTF-8">` first meta tag
- [ ] `<meta name="viewport" ...>`included
- [ ] `<title>` unique and descriptive
- [ ] `<meta name="description">` present
- [ ] `<link rel="canonical">` for duplicate URLs

### Headings & Content

- [ ] Only ONE `<h1>` per page
- [ ] Heading hierarchy: h1→h2→h3 (no skips)
- [ ] Headings are descriptive
- [ ] Skip navigation link present
- [ ] All text uses `useTranslations()`

### Landmarks

- [ ] `<header role="banner">` once (page-level)
- [ ] `<nav aria-label="...">` for all navigation
- [ ] `<main id="main-content">` once
- [ ] `<footer role="contentinfo">` once (page-level)
- [ ] `<article>` for independent content
- [ ] `<section aria-labelledby="...">` (with heading)
- [ ] `<aside>` for complementary content

### Images

- [ ] All `<img>` have `alt=""`
- [ ] Alt text is descriptive (not "image")
- [ ] All images have `width/height`
- [ ] Decorative images: `alt=""` (empty, not omitted)
- [ ] Images use `loading="lazy"` when below fold
- [ ] Images use `decoding="async"`

### Forms

- [ ] Every `<input>` has `<label htmlFor>`
- [ ] Form inputs have `name` attribute
- [ ] Required fields: `required` + `aria-required="true"`
- [ ] Error messages: `role="alert"` + `aria-describedby`
- [ ] Invalid inputs: `aria-invalid="true"`
- [ ] `<fieldset>` + `<legend>` for grouped inputs
- [ ] Password inputs: `autocomplete="current-password"`
- [ ] Email inputs: `inputMode="email"` + `autoComplete="email"`

### Interactive Elements

- [ ] All buttons: `<button type="button/submit/reset">`
- [ ] All links: proper `<a href="...">` with text
- [ ] Buttons with icons: `aria-label="..."` if no text
- [ ] Dropdowns: `aria-expanded` + `aria-controls`
- [ ] Modals: `aria-modal="true"` + `aria-labelledby`
- [ ] Menu items: `aria-current` for active state

### Keyboard Navigation

- [ ] `Tab` moves through interactive elements
- [ ] `Shift+Tab` moves backward
- [ ] `Enter` activates buttons
- [ ] `Space` activates buttons
- [ ] `Escape` closes dropdowns/modals
- [ ] Arrow keys work in lists/menus
- [ ] Focus visible (outline or highlight)
- [ ] Focus order logical (left-to-right, top-to-bottom)

### Accessibility Features

- [ ] Videos have `<track kind="captions">`
- [ ] Audio has transcripts available
- [ ] Tables have `<caption>` + proper `<th scope>`
- [ ] Lists use `<ul>`, `<ol>`, `<dl>` correctly
- [ ] `aria-live` for dynamic content updates
- [ ] Skip links styled to be visible on focus
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] No color-only distinction (also use icons/text)

### Mobile/Touch

- [ ] Touch targets ≥44×44px minimum
- [ ] Spacing between touch targets ≥8px
- [ ] No tap-delay issues
- [ ] Inputs have appropriate `inputMode`
- [ ] Inputs have `autoComplete` where appropriate
- [ ] Viewport meta tag set correctly
- [ ] No `user-scalable=no`

### Performance & SEO

- [ ] Open Graph meta tags (og:title, og:image, etc.)
- [ ] JSON-LD structured data (`schema.org`)
- [ ] `<link rel="alternate" hreflang="...">` for multi-language
- [ ] No broken links
- [ ] Images optimized (WebP, AVIF)
- [ ] No huge CSS/JS blocking render

---

**Last Updated:** 2026-06-18
**WCAG Standard:** 2.1 Level AA (minimum requirement)
