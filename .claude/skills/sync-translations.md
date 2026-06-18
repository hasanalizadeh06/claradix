---
name: sync-translations
description: Synchronize translation keys across all language files (az, en, ru)
argument-hint: "Optional: specific namespace to sync"
---

# /sync-translations

Synchronizes translation keys across all language files to ensure consistency.

## Usage

```bash
# Sync all languages
/sync-translations

# Sync specific namespace
/sync-translations BuyersPage
```

## What It Does

1. **Scans** all `messages/[locale].json` files
2. **Identifies** missing keys in any language
3. **Adds** missing keys to incomplete files
4. **Maintains** proper JSON structure
5. **Reports** all changes made

## Example

### Before
```json
// messages/az.json
{
  "HomePage": { "title": "Ana Səhifə" },
  "BuyersPage": { "title": "Alıcılar" }
}

// messages/en.json
{
  "HomePage": { "title": "Home" }
  // BuyersPage missing!
}

// messages/ru.json
{
  "HomePage": { "title": "Главная" },
  "BuyersPage": { "title": "Покупатели", "noData": "Нет данных" }
  // "noData" missing in other languages!
}
```

### After Running `/sync-translations`
```json
// messages/az.json (unchanged)
{
  "HomePage": { "title": "Ana Səhifə" },
  "BuyersPage": { "title": "Alıcılar", "noData": "TRANSLATE_ME" }
}

// messages/en.json (updated)
{
  "HomePage": { "title": "Home" },
  "BuyersPage": { "title": "TRANSLATE_ME", "noData": "TRANSLATE_ME" }
}

// messages/ru.json (unchanged)
{
  "HomePage": { "title": "Главная" },
  "BuyersPage": { "title": "Покупатели", "noData": "Нет данных" }
}
```

## Output Report

```
✅ Synchronization Complete

Changes Made:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 messages/en.json
  ✨ Added BuyersPage.title (placeholder: TRANSLATE_ME)
  ✨ Added BuyersPage.noData (placeholder: TRANSLATE_ME)

📄 messages/ru.json
  ✅ Already complete

📄 messages/az.json
  ✨ Added BuyersPage.noData (placeholder: TRANSLATE_ME)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Action Required:
  - 3 keys added with "TRANSLATE_ME" placeholder
  - Please translate these keys in each language file
  - Commit with message: "chore: sync translation keys"
```

## Notes

- Missing keys are added with `TRANSLATE_ME` placeholder
- Key structure is normalized (nested objects, proper ordering)
- File formatting preserved
- You should review and translate placeholder values
- Best practice: Run after adding new features that use translations

## Integration

Typically run:
- After `/create-entity` (automatically adds translation namespace)
- Before committing changes that add new `useTranslations()` calls
- In `/build-project` validation step
