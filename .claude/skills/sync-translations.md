---
name: sync-translations
description: Synchronize translation keys across all language files (az, en, ru)
argument-hint: "Optional context (e.g., 'added buyer entity with 5 fields')"
---

# /sync-translations

Synchronizes translation keys across all language files to ensure consistency.

## Format

```bash
/sync-translations [optional: context]
```

**[context]:** What changed? (which entity/page? new fields? deleted keys?)

## Usage Examples

✅ **With context (helpful):**
```bash
/sync-translations added buyer entity with name, email, phone fields
/sync-translations created login page with admin block message
/sync-translations updated product entity, removed old_price field
```

❌ **Without context (I'll run anyway):**
```bash
/sync-translations
↓
Me: Running full sync across az.json, en.json, ru.json
```

✅ **Specific namespace (optional):**
```bash
/sync-translations BuyersPage
↓
Me: Syncing BuyersPage namespace only
```

## If Arguments Are Missing

**You run:** `/sync-translations` (no context)

**I will:**
```
✓ Run full sync across az.json, en.json, ru.json
✓ Find all missing keys
✓ Add placeholders (TRANSLATE_ME)
✓ Report what changed
```

If you want to be more specific:

```
✓ What changed? (which entity/page? which fields?)
  → Your answer: added buyer entity with name, email, phone
```

---

## Questions I Will Ask

After syncing, I will report:

**Changes Made:**
- [ ] Which namespaces were added?
- [ ] Which keys were added?
- [ ] How many keys per language file?
- [ ] Which files needed updates?

**Next Steps:**
- [ ] Should I translate the keys now? (to which languages first?)
- [ ] Are TRANSLATE_ME placeholders OK, or provide translations?
- [ ] Any special keys needing context-specific translations?

---

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
