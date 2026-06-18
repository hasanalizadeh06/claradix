# 📘 SEMANTIC HTML — AI AGENT QAYDALARİ
> Bu fayl AI agentin hər yeni veb proyektdə avtomatik tətbiq etməli olduğu **mütləq qaydalar** toplusudur.
> Hər qayda əsaslandırılmışdır: niyə vacib olduğu, pozulduqda nə baş verir.

---

## 🚨 AGENT ÜÇÜN KRİTİK PRİNSİPLƏR (heç vaxt pozulmamalı)

```
QAYDA-0: Native HTML semantikası həmişə ARIA-dan üstündür.
  ✅ <button>Bağla</button>
  ❌ <div role="button" tabindex="0">Bağla</div>
  Səbəb: Native button klaviatura, fokus, click event-lərini avtomatik idarə edir.

QAYDA-1: Hər şey üçün <div> işlətmə — bu "div çorbası" problemidir.
  Brauzer, Google bot, screen reader üçün <div> HEÇNƏ ifadə etmir.

QAYDA-2: Accessibility ilk gündən — sonradan əlavə etmək 3x çox iş deməkdir.
  WCAG 2.1 AA səviyyəsi minimum standartdır.

QAYDA-3: Hər interaktiv element klaviatura ilə idarə edilə bilməlidir.
  Tab, Enter, Space, Escape, Arrow Keys — hamısı işləməlidir.

QAYDA-4: Hər şəkil üçün alt atributu mütləqdir (boş da olsa: alt="").
  alt olmayan <img> brauzer konsolunda xəta göstərir + WCAG pozuntusudur.
```

---

## 📄 SƏNƏD STRUKTURU

### `<!DOCTYPE html>`
```
MÜTLƏQDİR. Həmişə ilk sətir.
Olmadıqda brauzer "quirks mode"-a keçir → CSS/JS gözlənilmədən davranır.
```

### `<html lang="" dir="">`
```
lang atributu — MÜTLƏQ.
  - Screen reader-lər mətnin dilini müəyyən edir (tələffüz üçün).
  - Google axtarış dil hədəfləməsi üçün istifadə edir.
  - Brauzer spellcheck dili bu atributdan alır.
  Dəyərlər: "az" | "en" | "ru" | "tr" | "ar" | ...

dir atributu — default "ltr" (left-to-right).
  Ərəb/İbrani/Farsca üçün: dir="rtl"
  Qarışıq mətn üçün: <bdi> teqindən istifadə et.

AGENT QAYDASI: html teqini həmişə lang ilə yaz.
  ✅ <html lang="az" dir="ltr">
  ❌ <html>
```

---

## 🧠 HEAD BLOKU — TAM YOXLAMA SİYAHISI

### Agent hər <head> blokunda aşağıdakı sıranı izləməlidir:

```html
<!-- 1. Charset — İLK OLMALIDIR, başqa hər şeydən əvvəl -->
<meta charset="UTF-8" />

<!-- 2. Viewport — mobil üçün mütləq -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- 3. Base (lazım olduqda) -->
<base href="https://example.com/" />

<!-- 4. Title — hər səhifə üçün unikal -->
<title>Səhifə Adı | Sayt Adı</title>
<!--
  Qaydalar:
  - 50-60 simvol ideal
  - Formul: "Əsas Keyword | Sayt adı"
  - Hər səhifə fərqli title olmalı
  - Boş buraxılmamalı
-->

<!-- 5. SEO meta -->
<meta name="description" content="..." />
<!-- description: 150-160 simvol, unikal hər səhifə üçün -->

<meta name="robots" content="index, follow" />
<!-- robots: "noindex" deyilsə index+follow standard -->

<meta name="author" content="Ad Soyad" />
<meta name="theme-color" content="#hex" />

<!-- 6. Canonical — dublikat URL-ləri önləmək üçün -->
<link rel="canonical" href="https://example.com/tam-url" />
<!--
  Nə vaxt lazımdır:
  - http vs https
  - www vs non-www
  - trailing slash vs no slash
  - URL parametrləri (?sort=date, ?page=2)
  Həmişə absolute URL istifadə et.
-->

<!-- 7. Open Graph — sosial media preview -->
<meta property="og:type"        content="website|article|product" />
<meta property="og:title"       content="..." />
<meta property="og:description" content="..." />
<meta property="og:url"         content="https://..." />
<meta property="og:image"       content="https://...jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"   content="Şəkli izah edən mətn" />
<!-- og:image:alt — accessibility üçün mütləq -->
<meta property="og:locale"      content="az_AZ" />
<meta property="og:site_name"   content="Sayt adı" />

<!-- 8. Twitter Card -->
<meta name="twitter:card"    content="summary_large_image" />
<meta name="twitter:title"   content="..." />
<meta name="twitter:image"   content="https://..." />
<meta name="twitter:image:alt" content="..." />

<!-- 9. Favicon-lar -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />

<!-- 10. Preconnect — 3rd party domenlər üçün -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- 11. Preload — kritik resurslar üçün -->
<link rel="preload" as="font"  href="/fonts/main.woff2" type="font/woff2" crossorigin />
<link rel="preload" as="image" href="/images/hero.webp" fetchpriority="high" />

<!-- 12. Stylesheet -->
<link rel="stylesheet" href="/css/main.css" />
<link rel="stylesheet" href="/css/print.css" media="print" />

<!-- 13. Hreflang — çoxdilli saytlar üçün -->
<link rel="alternate" hreflang="az"      href="https://example.az/..." />
<link rel="alternate" hreflang="en"      href="https://example.az/en/..." />
<link rel="alternate" hreflang="x-default" href="https://example.az/..." />

<!-- 14. JSON-LD Structured Data -->
<script type="application/ld+json">{ ... }</script>
```

---

## 🏗️ LANDMARK TEQLƏRİ — MÜTLƏQ QAYDALAR

### `<header>`
```
IMPLICIT ROLE: banner (yalnız page-level olanda)

QAYDA: Səhifə başlığı üçün istifadə et.
  - <body>-nin birbaşa uşağı kimi — role="banner" qazanır
  - <article>/<section> içindəki <header> — generic role alır (banner deyil)
  - Bir səhifədə page-level <header> yalnız BİR dəfə

MÜTLƏQ:
  role="banner" — açıq yazmaq tövsiyə olunur (aydınlıq üçün)
  aria-label="Sayt başlığı" — bir neçə header olduqda

İÇİNDƏ NƏ OLUR:
  ✅ logo, nav, search, site name
  ❌ article məzmunu, main content

NÜMUNƏ:
  <header role="banner" aria-label="Sayt başlığı">
    <a href="/" aria-label="Ana Səhifə — Logo">...</a>
    <nav aria-label="Əsas naviqasiya">...</nav>
  </header>
```

### `<nav>`
```
IMPLICIT ROLE: navigation

QAYDA: Naviqasiya linklərinin qrupu üçün.
  - Birdən çox nav ola bilər — hər birinin aria-label-i OLMALIDIR
  - Kiçik link qrupları (2-3 link) nav olmaya bilər
  - Nav içindəki linklər mənalı olmalı

MÜTLƏQ:
  aria-label="..." — hər <nav> üçün, unikal ad
  Nümunə adlar:
    "Əsas naviqasiya"
    "Alt naviqasiya: Şirkət"
    "Breadcrumb naviqasiyası"
    "Məzmun cədvəli"
    "Sosial linklər"
    "Səhifə daxili naviqasiya"

QADAĞAN:
  ❌ <nav> içinə <nav> yerləşdirmə
  ❌ Əsas nav-dan başqa aria-label olmayan <nav>

NÜMUNƏ:
  <nav aria-label="Əsas naviqasiya">
    <ul role="list">
      <li><a href="/" aria-current="page">Ana Səhifə</a></li>
    </ul>
  </nav>
```

### `<main>`
```
IMPLICIT ROLE: main

QAYDA: Səhifənin əsas, unikal məzmunu üçün.

MÜTLƏQ:
  id="main-content" — skip link-in hədəfi
  tabindex="-1" — JS ilə fokuslanması üçün (skip link-dən sonra)

QADAĞAN:
  ❌ Bir səhifədə birdən çox <main>
  ❌ <header>, <footer>, <nav>-ın içinə yerləşdirmə
  ❌ Sidebar, nav, header content burada olmamalı

NÜMUNƏ:
  <main id="main-content" tabindex="-1" aria-label="Əsas məzmun">
    ...
  </main>
```

### `<article>`
```
IMPLICIT ROLE: article

QAYDA: Müstəqil, yenidən istifadə edilə bilən məzmun bloku.
  Testi: "Bu bloku çıxarıb başqa yerdə göstərsək mənalı olurmu?"
  Əvəbət HƏ isə → <article>

İSTİFADƏ YERLƏRİ:
  ✅ blog postu, xəbər məqaləsi, forum yazısı, şərh, kart
  ❌ sadə bölmə, layout bloku

MÜTLƏQ:
  aria-labelledby="heading-id" — article-ın başlığı ilə bağlı
  Article içindəki başlıq (h1-h6) olmalıdır

ARTICLE İÇİNDƏ ARTICLE:
  ✅ İcazəlidir — məs. əsas məqalə içindəki şərhlər

NÜMUNƏ:
  <article aria-labelledby="post-title" itemscope itemtype="https://schema.org/Article">
    <header>
      <h2 id="post-title">Məqalə Başlığı</h2>
      <address rel="author">Müəllif: <a href="/profil">Ad</a></address>
      <time datetime="2024-11-15">15 Noyabr 2024</time>
    </header>
    ...
    <footer>...</footer>
  </article>
```

### `<section>`
```
IMPLICIT ROLE: region (yalnız aria-labelledby/aria-label varsa)

QAYDA: Mövzuya aid məzmun bölməsi. Layout üçün deyil.

MÜTLƏQ:
  Daxilindəki BAŞLIQ (h2-h6) OLMALIDIR — bu elementin ən vacib qaydası
  aria-labelledby="heading-id" → o başlığın id-si ilə bağla

NÜMUNƏ:
  <section aria-labelledby="skills-heading">
    <h2 id="skills-heading">Bacarıqlar</h2>
    ...
  </section>

QADAĞAN:
  ❌ Başlıqsız <section>
  ❌ Layout container kimi (bunun üçün <div>)
  ❌ Generic wrapper kimi
```

### `<aside>`
```
IMPLICIT ROLE: complementary

QAYDA: Əsas məzmunla dolayı əlaqəli, əlavə məlumat.

İSTİFADƏ YERLƏRİ:
  ✅ Sidebar, əlaqəli linklər, reklam (kontekstual), qeydlər
  ✅ Məqalədaxili qeyd/sitat kutuları

MÜTLƏQ:
  aria-label="..." — bir neçə aside varsa fərqləndirmək üçün

NÜMUNƏ:
  <aside aria-label="Əlaqəli məqalələr">
    <h2>Əlaqəli</h2>
    <ul>...</ul>
  </aside>
```

### `<footer>`
```
IMPLICIT ROLE: contentinfo (yalnız page-level olanda)

QAYDA: Altlıq bloku.
  - <body>-nin birbaşa uşağı → role="contentinfo"
  - <article>/<section> içindəki <footer> → generic role

MÜTLƏQ:
  role="contentinfo" — açıq yazmaq tövsiyə olunur
  aria-label="Sayt altlığı"

İÇİNDƏ NƏ OLUR:
  ✅ copyright, əlaqə, lisenziya, nav (alt nav), sitemap linki
  ❌ Əsas məzmun

NÜMUNƏ:
  <footer role="contentinfo" aria-label="Sayt altlığı">
    <address>...</address>
    <nav aria-label="Alt naviqasiya">...</nav>
    <small>© 2024 Şirkət Adı</small>
  </footer>
```

### `<address>`
```
QAYDA: MÜƏLLİF/SAHİBİN KİMLİK VƏ ƏLAQƏ MƏLUMATLARİ ÜÇÜN.

YANLIZ ANLAŞILAN QAYDA:
  ❌ <address> poçt ünvanı deməkdir deyil!
  ✅ <address> = müəllif/sahib haqqında əlaqə məlumatı

İSTİFADƏ:
  ✅ Article müəllifi, sahibkar, şirkət əlaqəsi
  ❌ Adi ünvan məlumatı (bunun üçün <p> + microdata)

NÜMUNƏ:
  <!-- Article müəllifi üçün -->
  <address rel="author">
    Müəllif: <a href="/profil/ali" rel="author">Əli Həsənov</a>
  </address>

  <!-- Footer-da şirkət əlaqəsi -->
  <address>
    <a href="mailto:info@example.az">info@example.az</a>
    <a href="tel:+994501234567">+994 50 123 45 67</a>
  </address>
```

### `<search>` (HTML 5.3)
```
IMPLICIT ROLE: search

QAYDA: Axtarış forması bölgəsi üçün.
  HTML 5.3-də gəlib. Köhnə brauzerlər üçün role="search" da əlavə et.

NÜMUNƏ:
  <search aria-label="Sayt axtarışı">
    <form action="/axtar" method="get" role="search">
      <label for="q" class="sr-only">Axtar</label>
      <input type="search" id="q" name="q" />
      <button type="submit" aria-label="Axtarışa başla">🔍</button>
    </form>
  </search>
```

---

## 🔤 BAŞLIQ HİYERARXİYASİ (h1–h6)

```
MÜTLƏQ QAYDALAR:

1. h1 — YALNIZ BİR DƏFƏ hər səhifədə
   - Səhifənin əsas mövzusunu bildirir
   - Google bu elementi ən çox çəkilən başlıq kimi dəyərləndirir

2. ARDICIL OLMALIDIR — heç vaxt sıra keçmə
   ✅ h1 → h2 → h3 → h4
   ❌ h1 → h3 (h2 atlanıb!)
   ❌ h2 → h4 → h3 (pozulmuş sıra)

3. VİZUAL ÜÇÜN DEYİL, STRUKTUR ÜÇÜN
   Böyük görünmək üçün h1 istifadə etmə — bunun üçün CSS.

4. SCREEN READER NAVİQASİYASI
   Screen reader istifadəçiləri "başlıqlar siyahısı" ilə naviqasiya edir.
   Başlıqlar mənalı olmalıdır — "Klik et" deyil, "Əlaqə Forması".

AGENT YOXLAMA QAYDASI:
  - Hər səhifədə h1 tapılıb? (1 ədəd olmalı)
  - h1-dən sonra birbaşa h3 gəlirmi? → XƏTA
  - Başlıqlar məzmunu mənalı şəkildə izah edirmi?
```

---

## 📝 MƏTNLİK SEMANTİK TEQLƏR

### `<strong>` vs `<b>`
```
<strong> — məna daşıyan vaciblik (importance, seriousness)
  Screen reader-lər "güclü" kimi tələffüz edə bilər.
  ✅ Xəbərdarlıq, vacib məlumat, açar söz

<b> — yalnız vizual bold (typographic offset)
  Semantic məna yoxdur.
  ✅ Məhsul adları, açar sözlər (məna olmadan), inline style kimi

NÜMUNƏ:
  <p><strong>Diqqət:</strong> Bu əməliyyat geri qaytarıla bilməz.</p>
  <p>Məhsul: <b>iPhone 15 Pro</b> qiyməti dəyişdi.</p>
```

### `<em>` vs `<i>`
```
<em> — vurğu, ton emphasisi (stress emphasis)
  Screen reader-lər bunu fərqli tonda oxuya bilər.
  ✅ "Mən bu sözü vurğulamaq istəyirəm" mənasında

<i> — idiomatic/offset text
  Semantic məna yoxdur.
  ✅ Termin, xarici dil sözü, düşüncə, gəmi adı

NÜMUNƏ:
  <p>Siz <em>həqiqətən</em> bunu etmək istəyirsiniz?</p>
  <p>Proqramlaşdırmada <i>recursion</i> anlayışı...</p>
```

### `<mark>`
```
QAYDA: Məzmunun kontekstdə əhəmiyyəti vurğulanır.
  Əsas istifadə: axtarış nəticəsindəki uyğun sözlər.

NÜMUNƏ:
  <!-- Axtarış: "semantic html" -->
  <p>Bu bələdçi <mark>semantic html</mark> haqqındadır.</p>

QADAĞAN:
  ❌ Yalnız sarı rəng vermək üçün (bunun üçün CSS)
```

### `<time>`
```
QAYDA: Tarix, vaxt, müddət üçün — maşın oxunaqlı format.
  datetime atributu — ISO 8601 formatında.

FORMATlar:
  Tarix:             datetime="2024-11-15"
  Vaxt:              datetime="10:30"
  Tarix + vaxt:      datetime="2024-11-15T10:30:00+04:00"
  Ay:                datetime="2024-11"
  İl:                datetime="2024"
  Müddət:            datetime="PT5M30S" (5 dəq 30 san)
  Həftə:             datetime="2024-W46"

NÜMUNƏ:
  <time datetime="2024-11-15T10:00:00+04:00">15 Noyabr 2024, 10:00</time>
  <time datetime="PT23M">23 dəqiqə</time>
```

### `<abbr>`
```
QAYDA: Abbreviation/acronym üçün.
  title atributu — açıqlamanı tooltip olaraq göstərir.
  Screen reader-lər title-ı oxuyur.

QAYDA: İlk istifadədə həmişə açıqlama ver.

NÜMUNƏ:
  <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>
  <abbr title="Application Programming Interface">API</abbr>
```

### `<dfn>`
```
QAYDA: Bir termin ilk dəfə tərif edildikdə.
  id əlavə et — digər yerlərdən bura link edilsin.

NÜMUNƏ:
  <p>
    <dfn id="dfn-api">
      <abbr title="Application Programming Interface">API</abbr>
    </dfn>
    — iki proqram arasında əlaqə interfeysidir.
  </p>
  ...
  <a href="#dfn-api">API nədir?</a>
```

### `<cite>`
```
QAYDA: Yaradıcı əsərin adı üçün.
  KİTAB ADI, FİLM ADI, MƏQALƏ BAŞLIĞI, WEBSAYTİN ADİ.
  Müəllifin adı üçün DEYİL — bunun üçün <address> və ya plain text.

✅ <cite>Harry Potter</cite>
✅ <cite>MDN Web Docs</cite>
❌ <cite>Əli Həsənov</cite> (şəxs adı üçün deyil)
```

### `<blockquote>` + `<q>`
```
<blockquote> — uzun, blok-səviyyəli sitat.
  cite atributu — mənbənin URL-i (maşın üçün, görünmür).
  İçindəki <footer> + <cite> — görünən mənbə.

<q> — qısa, inline sitat.
  Brauzer avtomatik dırnaq əlavə edir.
  cite atributu — mənbənin URL-i.

NÜMUNƏ:
  <blockquote cite="https://www.w3.org/...">
    <p>Müəlliflər elementləri semantik dəyərlərinə görə istifadə etməlidir.</p>
    <footer>— <cite><a href="https://www.w3.org/">W3C HTML5 Spesifikasiyası</a></cite></footer>
  </blockquote>

  <p>Onlar <q cite="https://source.com">bunu dəstəkləyirik</q> dedi.</p>
```

### `<code>`, `<pre>`, `<kbd>`, `<samp>`, `<var>`
```
<code>  — inline kod parçası
<pre>   — preformatted text (boşluqlar saxlanılır)
<kbd>   — klaviatura girişi / istifadəçi əmri
<samp>  — proqramın output/nümunəsi
<var>   — riyazi/proqramlaşdırma dəyişəni

NÜMUNƏ:
  Əmri işlət: <kbd>npm install</kbd>
  Nəticə: <samp>added 42 packages</samp>
  Funksiyanın dəyəri: <var>n</var> = <var>n</var> - 1
  Kod: <code>const x = 42;</code>

  <pre><code class="language-js">
  function hello() {
    return "world";
  }
  </code></pre>
```

### `<del>` + `<ins>`
```
<del> — silinmiş məzmun (artıq keçərli deyil)
<ins> — əlavə edilmiş məzmun (yeni)
Hər ikisinin datetime atributu ola bilər.

NÜMUNƏ:
  Qiymət: <del datetime="2024-11-01">₼50</del> <ins datetime="2024-12-01">₼45</ins>
```

### `<s>`
```
QAYDA: Artıq dəqiq deyil, lakin silinməmişdir.
  <del>-dən fərqi: tarixi düzəliş deyil, cari dəqiqsizlik.

✅ Endirimdə olan köhnə qiymət
✅ Artıq mövcud olmayan məlumat
❌ Strike-through vizual effekti üçün (CSS işlət)

NÜMUNƏ:
  <s>Stokda mövcuddur</s> — hal-hazırda mövcud deyil
```

### `<sub>` + `<sup>`
```
<sub> — subscript (alt indeks)
<sup> — superscript (üst indeks)
YALNIZ MƏNA DAŞIDIQDA istifadə et, vizual üçün deyil.

✅ H<sub>2</sub>O, CO<sub>2</sub>
✅ E = mc<sup>2</sup>, X<sup>n</sup>
✅ Qeydlər: bax<sup>1</sup>
❌ Vizual kiçiltmək üçün
```

### `<small>`
```
QAYDA: Kiçik çap, hüquqi qeydlər, köməkçi məlumat.
  Məzmunun əhəmiyyətini azaltmır, yalnız ikinci dərəcəli göstərir.

✅ Copyright, lisenziya
✅ Məhsul kartında kateqoriya adı
✅ Qeyd-izahat
❌ Kiçik font vermək üçün (bunun üçün CSS)
```

### `<ruby>`, `<rt>`, `<rp>`
```
QAYDA: Asiya dilləri üçün fonetik göstərici.
  <ruby> — qrup
  <rt>   — fonetik oxunuş (üstdə göstərilir)
  <rp>   — ruby dəstəkləməyən brauzerlər üçün fallback mötərizə

NÜMUNƏ:
  <ruby>漢<rp>(</rp><rt>kan</rt><rp>)</rp>字<rp>(</rp><rt>ji</rt><rp>)</rp></ruby>
```

### `<bdi>` + `<bdo>`
```
<bdi> — Bidirectional Isolation
  Ərəbcə/farsca/ibrani adları latin mətndə qarışmasın deyə.
  ✅ İstifadəçi adları, dinamik mətn

<bdo dir="rtl"> — Bidirectional Override
  Mətnin istiqamətini məcburi dəyişdirir.

NÜMUNƏ:
  İstifadəçi: <bdi>مرحبا</bdi> (ərəb adı) login etdi.
```

### `<wbr>`
```
QAYDA: Uzun sözlərdə tövsiyə olunan sözqırma nöqtəsi.
  Uzun URL-lər, texniki terminlər, compound sözlər üçün.

NÜMUNƏ:
  https://example.az/very<wbr>long<wbr>path<wbr>/article
```

### `<hr>`
```
QAYDA: Tematik fasilə — mövzu dəyişir.
  Dekorativ ayırıcı üçün DEYİL — bunun üçün CSS border istifadə et.
  aria-label əlavə et — screen reader nə olduğunu bilsin.

✅ Məqalə bölmələri arasında mövzu dəyişikliyi
❌ Yalnız görsel ayırıcı kimi

NÜMUNƏ:
  <hr aria-label="Mövzu dəyişikliyi ayırıcısı" />
```

---

## 📋 SİYAHI TEQLƏR

### `<ul>` — Ordered olmayan siyahı
```
İSTİFADƏ:
  ✅ Sıra vacib olmayan siyahılar
  ✅ Naviqasiya menüləri
  ✅ Xüsusiyyətlər, imkanlar

MÜTLƏQ:
  role="list" əlavə et — CSS list-style: none silindiykdə
  VoiceOver (Safari) list role-u itirir.
  aria-label — kontekst verəndə.

NÜMUNƏ:
  <ul role="list" aria-label="Xüsusiyyətlər">
    <li>Sürətli performans</li>
    <li>Accessibility dəstəyi</li>
  </ul>
```

### `<ol>` — Ordered siyahı
```
İSTİFADƏ:
  ✅ Sıra vacib olan siyahılar
  ✅ Addımlar, instruksiyalar, sıralamalar
  ✅ Breadcrumb

ATRIBUTLAR:
  reversed — sıranı tərsinə çevirir
  start="N" — başlanğıc nömrəsini dəyişdirir
  type="1|A|a|I|i" — nömrələmə tipi

NÜMUNƏ:
  <ol aria-label="Quraşdırma addımları">
    <li>npm install edin</li>
    <li>Config faylını hazırlayın</li>
    <li>Server-i başladın</li>
  </ol>
```

### `<dl>` — Definition List
```
İSTİFADƏ:
  ✅ Termin-izahat cütlükləri
  ✅ Metadata (Müəllif: ..., Tarix: ..., Kateqoriya: ...)
  ✅ FAQ siyahısı

QAYDA:
  <dt> — termin/sual
  <dd> — izahat/cavab
  Bir <dt>-nin birdən çox <dd>-si ola bilər.
  Bir <dd>-nin birdən çox <dt>-si ola bilər (eyni izahat, fərqli terminlər).

NÜMUNƏ:
  <dl>
    <dt>WCAG</dt>
    <dd>Web Content Accessibility Guidelines</dd>
    <dd>W3C tərəfindən hazırlanmış accessibility standartları</dd>
    
    <dt>API</dt>
    <dt>Application Programming Interface</dt>
    <dd>İki proqram arasında əlaqə interfeysi</dd>
  </dl>
```

---

## 🖼️ MEDİA TEQLƏR

### `<img>`
```
MÜTLƏQ QAYDALAR:

1. alt atributu HƏMİŞƏ OLMALIDIR
   - Informative şəkil: məzmununu izah edən mətn
   - Decorative şəkil: alt=""  (boş, amma atribut olmalı)
   - Funksional şəkil (link/button): funksiyanı izah et

2. width + height — MÜTLƏQ
   CLS (Cumulative Layout Shift) önləmək üçün.
   Browser yer ayırır, şəkil yükləndikdə layout dəyişmir.

3. loading
   loading="lazy"   — below-the-fold şəkillər üçün
   loading="eager"  — above-the-fold, hero şəkillər üçün

4. decoding
   decoding="async" — şəkili main thread-dən kənarda decode et

5. fetchpriority
   fetchpriority="high" — LCP şəkili (hero, banner) üçün

ALT MƏTNİ YAZMA QAYDASI:
  - "Şəkil: ..." deyil — screen reader artıq "image" deyir
  - Şəkildə NƏ VAR + KONTEKST
  - Qısa amma informativ
  - "dekorativ şəkil" — alt="" (boş)

NÜMUNƏ:
  <!-- Informative -->
  <img src="ali.jpg"
       alt="Əli Həsənov — frontend developer, laptop qarşısında"
       width="400" height="400"
       loading="lazy"
       decoding="async" />

  <!-- Decorative -->
  <img src="divider.svg" alt="" width="800" height="4" />

  <!-- Link içindəki şəkil — linkdəki funksiyanı izah et -->
  <a href="/">
    <img src="logo.svg" alt="WebDev Academy AZ — Ana Səhifə" width="160" height="50" />
  </a>
```

### `<picture>`
```
QAYDA: Müxtəlif ekranlar/brauzerlər üçün fərqli şəkillər.
  <source> elementləri yuxarıdan aşağıya yoxlanılır, ilk uyğun seçilir.
  Mütləq fallback <img> olmalıdır (ən sonda).

FORMAT SİRASI (tövsiyə):
  1. AVIF (ən yaxşı sıxılma, az dəstək)
  2. WebP (yaxşı dəstək, yaxşı sıxılma)
  3. JPEG/PNG (universal fallback)

ATRIBUTLAR:
  type    — MIME type (image/avif, image/webp, image/jpeg)
  srcset  — fərqli ölçülər (480w, 768w, 1280w)
  sizes   — hansı ölçünü nə zaman yükləmək
  media   — media query (dark mode, print, screen size)

NÜMUNƏ:
  <picture>
    <source type="image/avif"
            srcset="/img/hero.avif 1x, /img/hero@2x.avif 2x" />
    <source type="image/webp"
            srcset="/img/hero-sm.webp 480w, /img/hero-lg.webp 1280w"
            sizes="(max-width: 480px) 100vw, 1280px" />
    <img src="/img/hero-lg.jpg"
         alt="..."
         width="1280" height="640"
         loading="eager"
         fetchpriority="high" />
  </picture>
```

### `<figure>` + `<figcaption>`
```
QAYDA: Şəkil, kod, cədvəl, audio, video — başlıqla birlikdə qruplaşdırma.
  figcaption — figure-ün yeganə başlığı.
  
MÜTLƏQ:
  aria-labelledby="figcaption-id" — figure-ü figcaption-a bağla

NÜMUNƏ:
  <figure aria-labelledby="chart-caption">
    <img src="chart.png" alt="2024-cü il satış artımı diaqramı" width="800" height="400" />
    <figcaption id="chart-caption">
      2024-cü il üzrə aylıq satış statistikası.
      <cite>Mənbə: Şirkət hesabatı</cite>
    </figcaption>
  </figure>
```

### `<video>`
```
MÜTLƏQ QAYDALAR:

1. controls atributu — HƏMIŞƏ. İstifadəçi idarə etməlidir.
2. preload="metadata" — yalnız metadata yüklə, mobil trafik qoru.
3. poster — önizləmə şəkli (video yüklənməmiş olanda).
4. aria-label — videonun məzmununu izah et.
5. crossorigin — CORS, track faylları üçün lazımdır.

ALTYAZI (TRACK) — MÜTLƏQ:
  <track kind="captions"> — lal istifadəçilər üçün (səs + musiqi)
  <track kind="subtitles"> — yalnız dialoq tərcüməsi
  <track kind="descriptions"> — görme əngəli üçün audio izahat
  srclang — dil kodu
  default — defolt aktiv track

QADAĞAN:
  ❌ autoplay — istifadəçi icazəsi olmadan (WCAG 1.4.2 pozuntusu)
  ❌ autoplay muted loop — yalnız dekorativ background video üçün
  ❌ controls olmayan video

FORMAT SİRASI:
  1. WebM (vp9, opus) — yaxşı sıxılma
  2. MP4 (h264) — universal dəstək

NÜMUNƏ:
  <video controls
         preload="metadata"
         poster="/img/poster.jpg"
         width="800" height="450"
         aria-label="Dərs videou: CSS Grid əsasları, 12 dəqiqə"
         crossorigin="anonymous">
    <source src="/video/lesson.webm" type="video/webm; codecs=vp9,opus" />
    <source src="/video/lesson.mp4"  type="video/mp4" />
    <track kind="captions"
           src="/captions/lesson-az.vtt"
           srclang="az"
           label="Azərbaycanca"
           default />
    <track kind="descriptions"
           src="/desc/lesson-az.vtt"
           srclang="az"
           label="Audio izahat" />
    <p>Brauzerin video dəstəkləmir. <a href="/video/lesson.mp4" download>Yüklə</a></p>
  </video>
```

### `<audio>`
```
MÜTLƏQ QAYDALAR:
  controls — həmişə
  preload="none" — mobil trafik üçün (istifadəçi klik etsin, sonra yüklənsin)
  aria-label — audio məzmununu izah et

FORMAT SİRASI:
  1. OGG (vorbis/opus)
  2. MP3
  3. AAC

NÜMUNƏ:
  <audio controls
         preload="none"
         aria-label="Podcast: Veb accessibility — 45 dəqiqəlik epizod">
    <source src="/audio/ep1.ogg" type="audio/ogg; codecs=vorbis" />
    <source src="/audio/ep1.mp3" type="audio/mpeg" />
    <track kind="captions" src="/captions/ep1.vtt" srclang="az" label="Transkript" default />
    <p>Brauzerin audio dəstəkləmir. <a href="/audio/ep1.mp3" download>Yüklə</a></p>
  </audio>
```

### `<iframe>`
```
MÜTLƏQ QAYDALAR:
  title — MÜTLƏQ. Screen reader-lər üçün iframe-in məqsədi.
  loading="lazy" — below-the-fold iframe-lər üçün
  sandbox — icazələri məhdudlaşdır
  referrerpolicy — məxfilik üçün

SANDBOX İCazəLƏRİ:
  allow-scripts         — JS icra etmə
  allow-same-origin     — eyni origin, cookies
  allow-forms           — formları göndər
  allow-popups          — popup aç
  allow-top-navigation  — ana səhifəyə naviqasiya

NÜMUNƏ:
  <iframe
    title="Ödəniş forması — Stripe"
    src="https://stripe.com/embed/..."
    width="400"
    height="300"
    loading="lazy"
    sandbox="allow-scripts allow-same-origin allow-forms"
    referrerpolicy="strict-origin-when-cross-origin"
    aria-label="Stripe ödəniş interfeysi">
    <p>iframe dəstəklənmir. <a href="https://payment.link">Ödəniş səhifəsi</a></p>
  </iframe>
```

### `<svg>` (Inline)
```
İKİ NÖV VAR:

1. Informative SVG (məna daşıyır):
   role="img" + aria-labelledby="title-id desc-id"
   <title id="...">Qısa ad</title>
   <desc id="...">Ətraflı izahat</desc>
   focusable="false" — IE11 bug fix

2. Decorative SVG (dekorativdir):
   aria-hidden="true"
   focusable="false"
   role atributu olmasın

NÜMUNƏ (informative):
  <svg role="img"
       aria-labelledby="svg-title svg-desc"
       focusable="false"
       viewBox="0 0 24 24">
    <title id="svg-title">Uğur ikona</title>
    <desc id="svg-desc">Yaşıl fonda ağ haşiye içindəki checkmark işarəsi</desc>
    <circle cx="12" cy="12" r="10" fill="green"/>
    <path d="M9 12l2 2 4-4" stroke="white" fill="none"/>
  </svg>

NÜMUNƏ (decorative):
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="..."/>
  </svg>
```

### `<canvas>`
```
QAYDA: JS ilə çizilən qrafika üçün.
  role="img" + aria-label — canvas-ı şəkil kimi tanıt
  Fallback HTML — canvas dəstəklənmədikdə

NÜMUNƏ:
  <canvas id="chart"
          width="600" height="400"
          role="img"
          aria-label="2024 illik gəlir diaqramı: Q1 ₼50K, Q2 ₼65K, Q3 ₼70K, Q4 ₼90K">
    <!-- Fallback -->
    <table aria-label="2024 illik gəlir cədvəli">
      <tr><th>Rüb</th><th>Gəlir</th></tr>
      <tr><td>Q1</td><td>₼50,000</td></tr>
      ...
    </table>
  </canvas>
```

---

## 📊 CƏDVƏL TEQLƏR

```
CƏDVƏL ACCESSIBILITY YOXLAMA SİYAHISI:

1. <caption> — MÜTLƏQ. Cədvəlin başlığı/məqsədi.
2. <th scope="col"> — sütun başlıqları üçün
3. <th scope="row"> — sıra başlıqları üçün
4. <thead>, <tbody>, <tfoot> — mütləq ayrılmalı
5. <colgroup>+<col> — sütunlara stil üçün
6. aria-describedby — əlavə izahat üçün

SCOPE DEĞERLƏRİ:
  scope="col"      — yuxarı sütun başlığı
  scope="row"      — sol sıra başlığı
  scope="colgroup" — sütun qrupu başlığı
  scope="rowgroup" — sıra qrupu başlığı

MÜRƏKKƏB CƏDVƏLLƏR (colspan/rowspan):
  <th id="th1">Başlıq 1</th>
  <td headers="th1">Dəyər</td>

QADAĞAN:
  ❌ Layout (dizayn) cədvəlləri — bunun üçün CSS Grid/Flexbox
  ❌ Başlıqsız cədvəl
  ❌ scope olmayan th

NÜMUNƏ:
  <table aria-describedby="table-note">
    <caption><strong>Proqramlama dilləri müqayisəsi</strong></caption>
    <colgroup>
      <col style="width:30%" />
      <col style="width:35%" />
      <col style="width:35%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">Dil</th>
        <th scope="col">Tiplər</th>
        <th scope="col">İstifadə sahəsi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">JavaScript</th>
        <td>Dinamik</td>
        <td>Frontend, Backend (Node.js)</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3"><small id="table-note">Mənbə: MDN Web Docs</small></td>
      </tr>
    </tfoot>
  </table>
```

---

## 📋 FORMA TEQLƏR

### `<form>`
```
MÜTLƏQ ATRIBUTLAR:
  novalidate — native validasiyanı söndür, custom JS istifadə et
  aria-label  — formanın məqsədi
  aria-describedby — ümumi form izahatının id-si

action + method — hər formada olmalı (JS submit olsa belə)

NÜMUNƏ:
  <form action="/submit"
        method="post"
        novalidate
        aria-label="Əlaqə forması"
        aria-describedby="form-desc">
    <p id="form-desc"><strong>*</strong> işarəli sahələr məcburidir.</p>
    ...
  </form>
```

### `<fieldset>` + `<legend>`
```
QAYDA: Əlaqəli form elementlərini qruplaşdırır.
  Screen reader-lər hər input üçün oxuyur: "Legend adı — Input adı"

MÜTLƏQ:
  <legend> — fieldset-in ilk uşağı, başlığını verir.

YALNIZ RADIO/CHECKBOX ÜÇÜN DEYİL:
  ✅ Şəxsi məlumat qrupu
  ✅ Ödəniş məlumatı
  ✅ Radio/checkbox qrupu
  ✅ Böyük form bölmələri

NÜMUNƏ:
  <fieldset>
    <legend>Çatdırılma Məlumatı</legend>
    <div class="form-group">
      <label for="addr">Ünvan</label>
      <input type="text" id="addr" name="address" autocomplete="street-address" />
    </div>
  </fieldset>
```

### `<label>`
```
MÜTLƏQ QAYDALAR:

1. Hər input üçün label — HƏMİŞƏ
2. for="input-id" — input ilə bağla
   YA DA: input-u label-in içinə yerlşədir (implicit label)
3. Görünən label ÜSTÜNDÜR — aria-label son çarə

QADAĞAN:
  ❌ placeholder-ı label kimi istifadə et
     (placeholder focus-da yox olur, accessibility problemdir)
  ❌ Labelsiz input

NÜMUNƏ:
  <!-- Explicit label (tövsiyə) -->
  <label for="email">E-poçt ünvanı</label>
  <input type="email" id="email" />

  <!-- Implicit label (alternativ) -->
  <label>
    E-poçt ünvanı
    <input type="email" />
  </label>

  <!-- Görünməz label (son çarə — axtarış sahəsi kimi) -->
  <label for="search" class="sr-only">Axtar</label>
  <input type="search" id="search" />
```

### Bütün `<input>` tipləri
```
INPUT TİPLƏRİ VƏ ATRIBUTLARI:

type="text"          — adi mətn
  autocomplete="name|email|username|..."
  minlength, maxlength, pattern
  spellcheck="true|false"

type="email"         — e-poçt
  autocomplete="email"
  inputmode="email"
  multiple (birdən çox email üçün)

type="password"      — şifrə
  autocomplete="current-password|new-password"
  minlength

type="tel"           — telefon
  autocomplete="tel"
  inputmode="tel"
  pattern="..." (format yoxlaması)

type="url"           — URL
  autocomplete="url"
  inputmode="url"

type="number"        — rəqəm
  min, max, step
  inputmode="numeric"
  aria-valuemin, aria-valuemax (screen reader üçün)

type="date"          — tarix
  min="YYYY-MM-DD", max="YYYY-MM-DD"
  autocomplete="bday|bday-year|..."

type="time"          — vaxt
  min="HH:MM", max="HH:MM", step (saniyə)

type="datetime-local"— tarix + vaxt

type="month"         — ay seçimi

type="week"          — həftə seçimi

type="color"         — rəng seçici
  value="#hex"

type="file"          — fayl yüklə
  accept="image/png,.pdf,..."
  multiple (birdən çox fayl)

type="range"         — sürgü
  min, max, step, value
  aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext

type="checkbox"      — işarələ
  checked (defolt işarəli)
  value (göndəriləcək dəyər)

type="radio"         — seçim düyməsi
  name (qrup adı — eyni olmalı)
  value, checked

type="search"        — axtarış
  role="searchbox" (açıq yazmaq olar)
  aria-autocomplete, aria-controls, aria-expanded

type="hidden"        — gizli məlumat
  name + value

HƏR INPUT ÜÇÜN MÜTLƏQ ATRIBUTLAR:
  id                — label bağlamaq üçün
  name              — server-ə göndəriləcək key
  aria-required="true" — məcburi sahə (+ required atributu)
  aria-invalid="false" — validasiyadan əvvəl false
  aria-describedby  — hint + error id-ləri
  autocomplete      — WCAG 1.3.5 tələbi
```

### `<textarea>`
```
NÜMUNƏ:
  <label for="message">Mesaj *</label>
  <textarea
    id="message"
    name="message"
    rows="5"
    cols="50"
    required
    aria-required="true"
    aria-describedby="msg-hint msg-count"
    aria-multiline="true"
    maxlength="1000"
    spellcheck="true"
    wrap="soft">
  </textarea>
  <span id="msg-hint" class="hint">Max 1000 simvol</span>
  <output id="msg-count" for="message" aria-live="polite">0/1000</output>
```

### `<select>`
```
NÜMUNƏ:
  <label for="country">Ölkə *</label>
  <select id="country" name="country"
          required aria-required="true"
          autocomplete="country-name">
    <option value="" disabled selected>Seçin...</option>
    <optgroup label="Qafqaz">
      <option value="AZ">Azərbaycan</option>
      <option value="GE">Gürcüstan</option>
    </optgroup>
  </select>
```

### `<datalist>`
```
QAYDA: <input>-a native autocomplete əlavə edir.
  <input>-un list atributu <datalist>-in id-sinə bağlıdır.

NÜMUNƏ:
  <label for="city">Şəhər</label>
  <input type="text" id="city" name="city"
         list="cities"
         aria-autocomplete="list" />
  <datalist id="cities">
    <option value="Bakı"></option>
    <option value="Gəncə"></option>
    <option value="Sumqayıt"></option>
  </datalist>
```

### `<output>`
```
QAYDA: Skriptin hesabladığı nəticə üçün.
  for — hansı inputlardan hesablanır.
  aria-live="polite" + aria-atomic="true" — dəyişəndə elan edir.

NÜMUNƏ:
  <output for="price quantity" aria-live="polite" aria-atomic="true">
    Cəm: ₼0
  </output>
```

### `<meter>`
```
QAYDA: Bəlli diapazondakı ölçülə bilən dəyər.
  ✅ Şifrə gücü, disk tutumu, səsvermə nəticəsi
  ❌ Tərəqqini (progress) göstərmək üçün — bunun üçün <progress>

ATRIBUTLAR:
  min, max — diapason
  value    — hazırkı dəyər
  low      — "aşağı" hədd (bu altında sarı/qırmızı)
  high     — "yüksək" hədd (bu üstündə yaşıl)
  optimum  — optimal nöqtə

NÜMUNƏ:
  <label for="strength">Şifrə gücü</label>
  <meter id="strength"
         min="0" max="4" value="2"
         low="1" high="3" optimum="4"
         aria-label="Şifrə gücü: orta"
         aria-describedby="strength-desc">
  </meter>
  <span id="strength-desc" aria-live="polite">Orta</span>
```

### `<progress>`
```
QAYDA: Tamamlanma vəziyyəti göstəricisi.
  ✅ Fayl upload, form addımları, yüklənmə
  ❌ Ölçülə bilən dəyər — bunun üçün <meter>

value olmadan → indeterminate (tam bilinmir) — fırlanan indicator

NÜMUNƏ:
  <label for="upload-progress">Yüklənmə vəziyyəti</label>
  <progress id="upload-progress"
            max="100" value="65"
            aria-label="Fayl yüklənməsi: 65%"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="65"
            aria-valuetext="65 faiz tamamlandı">
    65%
  </progress>
```

### `<button>`
```
MÜTLƏQ QAYDALAR:

1. Düzgün type istifadə et:
   type="submit"  — formu göndər (default — DIQQAT!)
   type="reset"   — formu sıfırla
   type="button"  — heç bir default davranış yox

2. Yalnız ikon varsa — aria-label MÜTLƏQ
3. aria-pressed — toggle button üçün
4. aria-expanded — dropdown/accordion üçün
5. aria-busy — loading vəziyyətini bildirir

QADAĞAN:
  ❌ <div onClick> — button kimi
  ❌ <a> — button kimi (link deyil)
  ❌ Tipini bildirməmək (type olmadan submit kimi davranır)

NÜMUNƏ:
  <!-- Normal -->
  <button type="button" aria-label="Menyu açmaq/bağlamaq"
          aria-expanded="false" aria-controls="menu-id">
    <svg aria-hidden="true" focusable="false">...</svg>
    Menyu
  </button>

  <!-- Toggle/Switch -->
  <button type="button" role="switch"
          aria-checked="false"
          aria-label="Bildirişlər">
    Söndürülüb
  </button>

  <!-- Loading vəziyyəti -->
  <button type="submit" aria-busy="true" disabled>
    <svg aria-hidden="true" class="spinner">...</svg>
    Göndərilir...
  </button>
```

---

## 🎭 İNTERAKTİV TEQLƏR

### `<details>` + `<summary>`
```
QAYDA: Native disclosure widget — JS-siz işləyir.
  Klaviatura ilə: Enter/Space açır/bağlayır.
  
open atributu — defolt açıq başlatır.
<summary> həmişə <details>-in ilk uşağı.

NÜMUNƏ:
  <!-- Bağlı -->
  <details>
    <summary>Daha ətraflı göstər</summary>
    <p>Ətraflı məlumat burada...</p>
  </details>

  <!-- Açıq başlayan -->
  <details open>
    <summary>Klaviatura qaydaları</summary>
    <ul>...</ul>
  </details>

ACCORDION PATTERN:
  Birdən çox details — native accordion.
  name atributu (Chrome 120+) — eyni name olan açılanda digərləri bağlanır.
  <details name="faq">
```

### `<dialog>`
```
QAYDA: Native modal/dialog elementi.

METODLAR:
  dialog.show()      — modalsız dialog (backdrop yox)
  dialog.showModal() — modal dialog (backdrop var, Escape bağlayır)
  dialog.close()     — bağla (returnValue saxlayır)

MÜTLƏQ ATRIBUTLAR:
  aria-labelledby="dialog-heading-id"
  aria-describedby="dialog-desc-id"
  aria-modal="true"

FOCUS TRAP:
  showModal() avtomatik focus trap yaradır.
  İlk fokuslanacaq element düzgün seçilməlidir.

NÜMUNƏ:
  <dialog id="confirm-dialog"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-desc"
          aria-modal="true">
    <article>
      <header>
        <h2 id="dialog-title">Silməni təsdiqlə</h2>
        <button type="button" aria-label="Dialogu bağla (Escape)"
                onclick="this.closest('dialog').close()">✕</button>
      </header>
      <p id="dialog-desc">Bu əməliyyat geri qaytarıla bilməz.</p>
      <form method="dialog">
        <menu>
          <li><button type="submit" value="confirm">Sil</button></li>
          <li><button type="button" onclick="this.closest('dialog').close()">İmtina</button></li>
        </menu>
      </form>
    </article>
  </dialog>

  <!-- Açmaq üçün -->
  <button onclick="document.getElementById('confirm-dialog').showModal()"
          aria-haspopup="dialog"
          aria-controls="confirm-dialog">
    Sil
  </button>
```

### `<menu>`
```
QAYDA: Kontekst menyusu, toolbar, button qrupu üçün.
  Dialog footer-da button-ları qruplaşdırmaq üçün istifadə et.
  <li> elementlərini ehtiva edir.
```

### `<template>`
```
QAYDA: JS ilə klonlanacaq HTML şablonu.
  Render edilmir, DOM-da gizli saxlanılır.
  
JS istifadəsi:
  const tmpl = document.getElementById('my-template');
  const clone = tmpl.content.cloneNode(true);
  document.body.appendChild(clone);

NÜMUNƏ:
  <template id="card-template">
    <article class="card" aria-label="">
      <h3 class="card-title"></h3>
      <p class="card-desc"></p>
    </article>
  </template>
```

---

## ♿ ARIA — TAM ATRIBUT SƏNƏDİ

### Accessibility Name Hierarchy
```
Screen reader-lər accessible name-i bu sıra ilə axtarır:
1. aria-labelledby (ən güclü)
2. aria-label
3. Native label (for="id")
4. title atributu
5. Mətn məzmunu (button text, link text)

QAYDA: aria-labelledby > aria-label > native label
```

### `aria-label`
```
NƏ ÜÇÜN: Elementi birbaşa adlandırmaq.
NƏ VAXT: Görünən mətn yoxdur/azdır.

✅ İkon düymələri: <button aria-label="Bağla">✕</button>
✅ Birdən çox eyni mətnli element:
   <a href="/en1" aria-label="Ətraflı: Məqalə 1 haqqında">Ətraflı</a>
✅ Landmark-ları fərqləndirmək:
   <nav aria-label="Əsas naviqasiya">

QADAĞAN:
  ❌ Görünən mətnlə eyni — redundant
  ❌ aria-label="button" — rolu təkrarlama
```

### `aria-labelledby`
```
NƏ ÜÇÜN: Başqa elementin mətnini bu elementin adı kimi istifadə et.
Çoxlu id verə bilərsən (boşluqla ayrılmış).

✅ <section aria-labelledby="section-heading">
   <h2 id="section-heading">Xüsusiyyətlər</h2>

✅ Modal: <dialog aria-labelledby="modal-title modal-subtitle">

✅ Form qrupu:
   <span id="label">Şifrə gücü</span>
   <meter aria-labelledby="label">
```

### `aria-describedby`
```
NƏ ÜÇÜN: Əlavə izahat mətnini əlaqələndirir.
aria-labelledby-dan SONRA oxunur.
Çoxlu id mümkündür.

✅ Form hints:
   <input aria-describedby="hint1 error1">
   <span id="hint1">Min 8 simvol</span>
   <span id="error1" role="alert">Şifrə zəifdir</span>

✅ Cədvəl izahatı:
   <table aria-describedby="table-note">

✅ Dialog açıqlaması:
   <dialog aria-describedby="dialog-desc">
```

### `aria-hidden`
```
NƏ ÜÇÜN: Elementi accessibility tree-dən çıxar.
Screen reader görməz, klaviatura ilə çatmaz.

✅ Dekorativ ikon: <svg aria-hidden="true">
✅ Duplikat mətn: <span aria-hidden="true">●</span>
✅ Animation/loader (mətn başqa yerdə): <div class="spinner" aria-hidden="true">

QADAĞAN:
  ❌ Fokuslanabilən elementlər üzərindən (link, button, input)
  ❌ Mühüm məzmun üzərindən
  ❌ role="presentation" ilə qarışdırma (fərqlidirlər)
```

### `aria-live`
```
NƏ ÜÇÜN: Dinamik məzmun dəyişdikdə screen reader elan etsin.

DEĞERLƏRİ:
  "off"       — elan etmə (default)
  "polite"    — istifadəçi boş olduqda elan et (çox istifadə)
  "assertive" — dərhal kəsib elan et (YALNIZ KRİTİK XƏTA)

QAYDA: "assertive" yalnız ciddi xəta/xəbərdarlıq üçün.
Adi update üçün "polite".

NÜMUNƏ:
  <!-- Status bildirişi -->
  <div role="status" aria-live="polite" aria-atomic="true">
    3 nəticə tapıldı
  </div>

  <!-- Kritik xəta -->
  <div role="alert" aria-live="assertive">
    Ödəniş uğursuz oldu. Yenidən cəhd edin.
  </div>
```

### `aria-atomic`
```
NƏ ÜÇÜN: Dəyişiklikdə bütün bölgəni yoxsa yalnız dəyişəni elan et.

"true"  — bütün məzmunu bir dəfəyə elan et (çox istifadə)
"false" — yalnız dəyişən hissəni elan et

NÜMUNƏ:
  <output aria-live="polite" aria-atomic="true">
    Cəmi: ₼150
  </output>
```

### `aria-relevant`
```
NƏ ÜÇÜN: Hansı növ dəyişikliyi elan et.
Default: "additions text"

DEĞERLƏRİ:
  "additions" — yeni elementlər əlavə olunduqda
  "removals"  — elementlər silindikdə
  "text"      — mətn dəyişdikdə
  "all"        — hamısı

NÜMUNƏ:
  <ul aria-live="polite" aria-relevant="additions removals">
    <!-- Dinamik siyahı -->
  </ul>
```

### `aria-expanded`
```
NƏ ÜÇÜN: Açılan/bağlanan elementi idarə edən elementdəki vəziyyət.

NÜMUNƏ:
  <button aria-expanded="false" aria-controls="panel-id">
    Dropdown
  </button>
  <ul id="panel-id" hidden>...</ul>

  <!-- JS: -->
  btn.setAttribute('aria-expanded', 'true');
  panel.removeAttribute('hidden');

QAYDA: HƏMIŞƏ aria-controls ilə birlikdə istifadə et.
```

### `aria-haspopup`
```
NƏ ÜÇÜN: Element popup/menü/dialog açır.

DEĞERLƏRİ:
  "menu"    — dropdown menü
  "listbox" — combobox listbox
  "tree"    — tree widget
  "grid"    — data grid
  "dialog"  — modal dialog
  "true"    — generic popup (köhnə, istifadə etmə)

NÜMUNƏ:
  <button aria-haspopup="menu" aria-expanded="false">
    Fayllar
  </button>
  <button aria-haspopup="dialog" onclick="modal.showModal()">
    Sil
  </button>
```

### `aria-controls`
```
NƏ ÜÇÜN: Bu element hansı digər elementi idarə edir.
ID-lərlə (boşluqla ayrılmış).

NÜMUNƏ:
  <button aria-controls="panel sidebar" aria-expanded="false">
```

### `aria-current`
```
NƏ ÜÇÜN: Aktiv/hazırkı elementin bildirimi.

DEĞERLƏRİ:
  "page"     — hazırkı naviqasiya linkinin səhifəsi
  "step"     — wizard-da aktiv addım
  "location" — breadcrumb-da hazırkı yer
  "date"     — tarix seçicidə seçilmiş tarix
  "time"     — vaxt seçicidə seçilmiş vaxt
  "true"     — digər hallarda

NÜMUNƏ:
  <!-- Nav -->
  <a href="/haqqimizda" aria-current="page">Haqqımızda</a>

  <!-- Breadcrumb -->
  <li><span aria-current="location">Semantic HTML</span></li>

  <!-- Dil seçimi -->
  <a href="/az" aria-current="true" lang="az">AZ</a>
```

### `aria-selected`
```
NƏ ÜÇÜN: Tab, listbox, option elementlərinin seçilmə vəziyyəti.
QADAĞAN: checkbox/radio üçün (bunlar aria-checked istifadə edir).

NÜMUNƏ:
  <div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
  </div>
```

### `aria-checked`
```
NƏ ÜÇÜN: Checkbox, radio, switch vəziyyəti.

DEĞERLƏRİ:
  "true"   — seçilmiş
  "false"  — seçilməmiş
  "mixed"  — qismən seçilmiş (parent checkbox)

NÜMUNƏ:
  <button role="switch" aria-checked="true" aria-label="Bildirişlər">
    Aktiv
  </button>
```

### `aria-pressed`
```
NƏ ÜÇÜN: Toggle button-un basılma vəziyyəti.

NÜMUNƏ:
  <button type="button" aria-pressed="false" aria-label="Bəyən">
    👍 Bəyən
  </button>
  <!-- Basıldıqda: aria-pressed="true" -->
```

### `aria-disabled`
```
NƏ ÜÇÜN: Elementi deaktiv et, amma fokuslanabilən saxla.
disabled atributundan fərqi: fokus alır, screen reader oxuyur.

✅ Wizard addımı — həmişə görünür, açıqlanır, amma aktiv deyil
✅ Tooltip ilə birlikdə (niyə disabled izah üçün)

NÜMUNƏ:
  <button type="button" aria-disabled="true"
          aria-describedby="disabled-reason">
    Davam et
  </button>
  <span id="disabled-reason" class="sr-only">
    Əvvəlki addımı tamamlayın
  </span>
```

### `aria-required`
```
NƏ ÜÇÜN: Sahənin məcburi olduğunu bildirir.
required HTML atributu ilə birlikdə işlət.

NÜMUNƏ:
  <input required aria-required="true" />
```

### `aria-invalid`
```
NƏ ÜÇÜN: Validasiya nəticəsi.

DEĞERLƏRİ:
  "true"     — xəta var
  "false"    — xəta yox (default)
  "grammar"  — qrammatika xətası
  "spelling" — yazı xətası

QAYDA: aria-errormessage ilə birlikdə istifadə et.

NÜMUNƏ:
  <input aria-invalid="true" aria-errormessage="email-error" />
  <span id="email-error" role="alert">
    Düzgün e-poçt ünvanı daxil edin
  </span>
```

### `aria-errormessage`
```
NƏ ÜÇÜN: Xəta mesajının id-sini göstərir.
aria-invalid="true" ilə birlikdə işlət.
aria-describedby-dan fərqli: yalnız xəta üçün.
```

### `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`
```
NƏ ÜÇÜN: Range, slider, progressbar, spinbutton üçün dəyər bildirimi.

aria-valuemin  — minimum dəyər
aria-valuemax  — maksimum dəyər
aria-valuenow  — hazırkı dəyər (rəqəm)
aria-valuetext — hazırkı dəyərin mətn ifadəsi ("Orta", "75%", "5 il")

NÜMUNƏ:
  <input type="range"
         aria-valuemin="0"
         aria-valuemax="100"
         aria-valuenow="65"
         aria-valuetext="65 faiz" />
```

### `aria-busy`
```
NƏ ÜÇÜN: Element yüklənir/güncəllənir — screen reader gözləsin.

"true"  — yüklənir
"false" — tamamlandı

NÜMUNƏ:
  <button type="submit" aria-busy="true">
    <svg aria-hidden="true" class="spinner">...</svg>
    Göndərilir...
  </button>
```

### `aria-keyshortcuts`
```
NƏ ÜÇÜN: Klaviatura qısayolunu screen reader-ə bildir.

NÜMUNƏ:
  <button aria-keyshortcuts="Control+S">Yadda saxla</button>
```

### `aria-roledescription`
```
NƏ ÜÇÜN: Element-in role-nun daha aydın izahatı.
Slide, Card kimi custom komponent adlandırma üçün.

NÜMUNƏ:
  <div role="group" aria-roledescription="slide" aria-label="2-ci slayd">
```

### `aria-modal`
```
NƏ ÜÇÜN: Screen reader-ə modal kontekstini bildir.
Dialogun arxasındakı məzmunun oxunmasını önləyir.
<dialog> + showModal() istifadə edirsənsə, bu avtomatik idarə edilir.

NÜMUNƏ:
  <div role="dialog" aria-modal="true" aria-labelledby="title">
```

---

## 🔑 ROLE DEĞERLƏRİ

### Landmark roles (landmark naviqasiya üçün)
```
banner        — header (page-level)
navigation    — nav
main          — main
complementary — aside
contentinfo   — footer (page-level)
search        — search forması
form          — form (aria-label varsa)
region        — section (aria-labelledby varsa)
```

### Widget roles
```
button        — düymə
link          — link
checkbox      — işarələ qutu
radio         — seçim düyməsi
switch        — toggle/açar
tab           — tab panelinin başlığı
tabpanel      — tab panelinin məzmunu
tablist       — tab-ların konteyneri
combobox      — açılan seçim qutusu
listbox       — seçim siyahısı
option        — listbox-daki seçim
slider        — sürgü
spinbutton    — rəqəm artırma/azaltma
progressbar   — tərəqqi çubuğu
scrollbar     — sürüşmə çubuğu
```

### Document structure roles
```
article       — müstəqil məzmun
definition    — termin izahatı
directory     — siyahı/indeks
document      — sənəd
figure        — figure+figcaption qrupu
group         — əlaqəli elementlər qrupu
heading       — başlıq
img           — şəkil
list          — siyahı
listitem      — siyahı elementi
math          — riyazi ifadə
none|presentation — semantic mənanı sil
note          — qeyd/izahat
term          — termin
```

### Live region roles
```
alert         — kritik mesaj (assertive)
alertdialog   — kritik dialog
log           — xronoloji log
marquee       — sürüşən mətn (istifadə etmə)
status        — status mesajı (polite)
timer         — sayaç
```

---

## 🔗 NAVİGASİYA VƏ LİNKLƏR

### `<a>` — Link qaydaları
```
MÜTLƏQ QAYDALAR:

1. href — mütləq olmalı.
   href olmayan <a> — semantik deyil, button kimi davranmır.

2. Mətn mənalı olmalı — "Klik et" / "Burada" QADAĞAN
   ❌ <a href="/article">Ətraflı</a> (nə haqqında?)
   ✅ <a href="/article">Semantic HTML haqqında ətraflı</a>
   YA DA: <a href="/article" aria-label="Semantic HTML haqqında ətraflı">Ətraflı</a>

3. Xarici linklər:
   target="_blank" — yeni tab
   rel="noopener noreferrer" — security
   aria-label="... (yeni pəncərədə açılır)" — istifadəçini xəbərdar et

4. aria-current="page" — aktiv naviqasiya linki

5. rel atributları:
   rel="author"    — müəllif linki
   rel="license"   — lisenziya linki
   rel="nofollow"  — Google bu linki izləməsin
   rel="prev/next" — pagination
   rel="tag"       — məzmun teqi

NÜMUNƏ:
  <a href="/en/article"
     hreflang="en"
     lang="en"
     rel="external noopener noreferrer"
     target="_blank"
     aria-label="English version (opens in new tab)">
    EN
  </a>
```

### Skip Navigation
```
MÜTLƏQ: Hər saytda skip link olmalıdır.
Keyboard istifadəçiləri naviqasiyanı atlaya bilsin.
WCAG 2.4.1 (bypass blocks) tələbi.

NÜMUNƏ:
  <a href="#main-content" class="skip-link">Əsas məzmuna keç</a>
  <a href="#site-nav"     class="skip-link">Naviqasiyaya keç</a>

  CSS:
  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    z-index: 9999;
    transition: top 0.2s;
  }
  .skip-link:focus { top: 1rem; }
```

---

## 🔍 SEO CHECKLIST

```
[ ] <title> unikal, 50-60 simvol
[ ] <meta description> unikal, 150-160 simvol
[ ] <link rel="canonical"> düzgün absolute URL
[ ] <html lang="..."> düzgün dil kodu
[ ] Hər səhifədə yalnız bir <h1>
[ ] Başlıq hierarxiyası pozulmamış (h1→h2→h3)
[ ] Bütün şəkillərin alt atributu var
[ ] Open Graph teqləri (og:title, og:description, og:image, og:image:alt)
[ ] Twitter Card teqləri
[ ] JSON-LD Structured Data (TechArticle, BreadcrumbList, FAQPage...)
[ ] hreflang (çoxdilli sayt üçün)
[ ] <link rel="alternate" type="application/rss+xml"> (blog üçün)
[ ] Sitemap linki footer-da
[ ] <address> sahibkar məlumatları üçün
[ ] <time datetime="..."> bütün tarixlər üçün
[ ] Semantic HTML struktur (header, nav, main, article, aside, footer)
```

---

## ⚡ PERFORMANs YOXLAMA SİYAHISI

```
[ ] <link rel="preconnect"> 3rd party domenləri üçün
[ ] <link rel="preload"> kritik font + hero şəkli üçün
[ ] fetchpriority="high" — LCP (hero) şəkli üçün
[ ] loading="lazy" — below-the-fold şəkillər
[ ] decoding="async" — bütün şəkillər
[ ] width + height — bütün şəkillər (CLS önlər)
[ ] <picture> + WebP/AVIF format dəstəyi
[ ] <script defer> — əsas JS faylları
[ ] <script async> — analytics/3rd party
[ ] Critical CSS inline, qalan stylesheet deferred
[ ] preload="none" — audio (mobil trafik)
[ ] preload="metadata" — video
```

---

## ❌ YAYĞIN XƏTALARIN CƏDVƏLİ

| Xəta | Niyə Problem | Düzgün Yol |
|------|-------------|------------|
| `<div class="button">` | Keyboard, click event, focus yoxdur | `<button type="button">` |
| `<div class="nav">` | Screen reader tanımır | `<nav aria-label="...">` |
| `<img>` → alt yoxdur | WCAG A pozuntusu, screen reader "unnamed image" deyir | `alt="..."` (dekorativdirsə `alt=""`) |
| h1-dən h3-ə keçmək | Screen reader users "h2" nə olduğunu bilmir | Ardıcıl: h1→h2→h3 |
| Birdən çox `<h1>` | Google əsas başlığı müəyyən edə bilmir | Yalnız bir h1 |
| `<a>` düymə kimi | Link naviqasiya üçündür, action üçün deyil | `<button>` |
| `placeholder` label kimi | Focus-da yox olur, accessibility problem | `<label for="...">` |
| `target="_blank"` → `rel` yoxdur | Security (tabnapping) + istifadəçi xəbərdar deyil | `rel="noopener noreferrer"` + aria-label |
| `<table>` → `scope` yoxdur | Screen reader sütun/sıra əlaqəsini bilmir | `scope="col/row"` |
| `<video>` → `controls` yoxdur | İstifadəçi idarə edə bilmir (WCAG 1.4.2) | `controls` mütləq |
| `<video>` → `<track>` yoxdur | Lal istifadəçilər üçün erişilməz | `<track kind="captions">` |
| `<button>` → `type` yoxdur | Default `type="submit"` — yanlış davranış | `type="button/submit/reset"` |
| `aria-label="button"` | Role redundant | Yalnız məzmun: `aria-label="Bağla"` |
| `<section>` başlıqsız | Screen reader "unnamed region" | `<h2 id="x">` + `aria-labelledby="x"` |
| `role="presentation"` fokuslanabilən elementdə | Fokus itirilir | Yalnız dekorativ layout üçün |
| CSS `list-style:none` → `role` yoxdur | VoiceOver list kimi oxumur | `<ul role="list">` |
| `<address>` ünvan üçün | `<address>` yalnız müəllif/sahib məlumatı | `<p>` + microdata |
| `aria-live="assertive"` hər yerdə | İstifadəçinin oxumağını kəsir | Yalnız kritik xəta üçün |
| `<b>` vacib məlumat üçün | Semantic məna yoxdur | `<strong>` |
| `<i>` vurğu üçün | Semantic məna yoxdur | `<em>` |

---

## 🎯 AGENT ÜÇÜN QƏRAR AĞACI

### "Bu element üçün nə işlətməliyəm?"

```
İSTİFADƏÇİ TƏDBİQ EDİR (klik, submit, toggle)?
  → <button type="button|submit|reset">

BAŞQA SƏHIFƏYƏ/URL-Ə GEDİR?
  → <a href="...">

MÜSTƏQIL OXUNA BİLƏN MƏZMUNDUR? (blog, xəbər, şərh, kart)
  → <article>

MÖVZUYA AİD BÖLMƏ?
  → <section aria-labelledby="h-id"> + başlıq

NAVIQASIYA LİNKLƏRİ?
  → <nav aria-label="...">

SAYTLAŞMA BAŞLIĞI?
  → <header role="banner">

SAYT ALTLIĞI?
  → <footer role="contentinfo">

ƏSA MƏZMUNLA DOLAYIƏLAQƏLI MƏLUMAT?
  → <aside aria-label="...">

SIRA VACIB SİYAHI?
  → <ol>

SIRA VAciB DEYİL?
  → <ul role="list">

TERMİN-İZAHAT?
  → <dl><dt><dd>

ŞƏKİL + BAŞLIQ?
  → <figure><img alt="..."><figcaption>

YALNIZ DEKORATIV ŞƏKİL?
  → <img alt=""> (boş alt)

MÜXTƏLİF EKRANLAR ÜÇÜN ŞƏKİL?
  → <picture><source><img>

VİDEO?
  → <video controls preload="metadata"><source><track>

AUDIO?
  → <audio controls preload="none"><source><track>

CƏDVƏL DATA?
  → <table><caption><thead><tbody><tfoot>

FORM QRUPU?
  → <fieldset><legend>

DİNAMİK MƏLUMATı GÖSTƏR?
  → <output aria-live="polite">

TƏRƏQQI GÖSTƏR?
  → <progress>

ÖLÇÜLƏ BİLƏN DƏYƏR? (şifrə gücü, disk dolumu)
  → <meter>

AÇILIP-BAĞLANAN MƏZMUN?
  → <details><summary>

MODAL DIALOG?
  → <dialog aria-labelledby aria-modal="true">

HAMISI DEYİL → LAYOUT ÜÇÜN?
  → <div> (semantic məna olmadan)
```

---

## 📱 MOBİL ACCESSIBILITY QAYDALAR

```
TOUCH HƏDƏFİ:
  Min 44×44px (WCAG 2.5.5 AAA)
  Min 24×24px (WCAG 2.5.8 AA - yeni)
  Elementlər arasında min 8px boşluq

VIEWPORT:
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  user-scalable=no QADAĞAN (zoom lazımdır)

INPUTMODE:
  inputmode="numeric" — rəqəm klaviaturası
  inputmode="email"   — e-poçt klaviaturası
  inputmode="tel"     — telefon klaviaturası
  inputmode="url"     — URL klaviaturası

AUTOCOMPLETE:
  autocomplete="name|email|tel|..." — form doldurma asanlaşır
  WCAG 1.3.5 tələbi
```

---

## 🎨 CSS İLƏ SEMANTIC HTML ƏLAQƏSI

```
AGENT QAYDASI: Vizual dəyişiklik üçün heç vaxt HTML dəyiş.

❌ h3-ü h2 kimi göstərmək üçün h2 işlətmə:
   <h2>Bu h3 olmalıdır</h2>  ← XƏTA

✅ CSS ilə istədiyin vizualı ver:
   <h3 class="looks-like-h2">Bu h3-dür amma h2 kimi görünür</h3>

CSS-in semantic HTML-i pozmama qaydaları:
  list-style: none → <ul> üçün role="list" əlavə et
  outline: none    → :focus-visible alternativ stilini ver
  display: none    → aria-hidden="true" ilə birlikdə işlət
  visibility:hidden → aria-hidden="true"
  opacity: 0       → bu elementin fokus almaması üçün tabindex="-1"

PREFERS-REDUCED-MOTION:
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; }
  }

PREFERS-COLOR-SCHEME:
  @media (prefers-color-scheme: dark) { ... }
  @media (prefers-color-scheme: light) { ... }

PREFERS-CONTRAST:
  @media (prefers-contrast: more) {
    /* Yüksək kontrast modu */
  }
```

---

## 🔒 TƏHLÜKƏSİZLİK VƏ MƏXFILLIK

```
REL ATRİBUTLARI:
  Xarici linklər üçün: rel="noopener noreferrer"
    noopener  — window.opener-ə giriş önlər (XSS riski)
    noreferrer — referer header göndərmir (məxfilik)

IFRAME:
  sandbox atributu həmişə → lazımsız icazəsiz saxla
  referrerpolicy="strict-origin-when-cross-origin"

INPUT:
  autocomplete="off" — şifrə manager bloklaması üçün deyil,
                       bank kartı nömrəsi kimi həssas sahələr üçün

CSRF:
  <input type="hidden" name="_csrf" value="..." />
  Hər POST forması üçün mütləq
```

---

## 📋 AGENT ÜÇÜN SƏHIFƏ AÇILIŞINDA YOXLAMA

Hər yeni HTML faylı yaratdıqda bu siyahıya uyğun yoxla:

```
□ <!DOCTYPE html> ilk sətirdədir
□ <html lang="az"> (yaxud uyğun dil)
□ <meta charset="UTF-8"> — birinci meta
□ <meta name="viewport"> — ikinci meta
□ <title> — unikal, 50-60 simvol
□ <meta name="description"> — unikal, 150-160 simvol
□ <link rel="canonical"> — absolute URL
□ OG meta teqləri (og:title, og:image, og:image:alt)
□ JSON-LD structured data
□ Skip navigation link (Tab-da görünür)
□ <header role="banner"> — bir dəfə
□ <nav aria-label="..."> — bütün nav-larda
□ <main id="main-content" tabindex="-1"> — bir dəfə
□ <footer role="contentinfo"> — bir dəfə
□ Yalnız bir h1
□ Başlıq hierarxiyası ardıcıl
□ Bütün şəkillərdə alt atributu
□ Bütün şəkillərdə width + height
□ Bütün input-larda label
□ Bütün formlarda novalidate
□ Bütün düymələrdə type atributu
□ Xarici linklər: target="_blank" + rel="noopener noreferrer"
□ Bütün video-larda controls + track
□ Bütün iframe-lərdə title
□ Bütün SVG-lərdə role="img"/"presentation" + aria-hidden
□ <noscript> fallback (lazım olduqda)
```

---

*Bu fayl WebDev Academy AZ AI Agent üçün hazırlanmışdır.*
*Son yeniləmə: 2024-12-01*
*Standartlar: WCAG 2.1 AA, WAI-ARIA 1.2, HTML Living Standard*
