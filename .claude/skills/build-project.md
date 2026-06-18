---
name: build-project
description: Full validation pipeline (Prettier, ESLint, TypeCheck, Tests, Build)
argument-hint: "Optional: context (e.g., 'before deployment' or '--skip-tests for quick check')"
---

# /build-project

Runs comprehensive validation pipeline: format → lint → type-check → tests → build.

## Format

```bash
/build-project [optional: flags or context]
```

**Flags (optional):**
- `--skip-tests` → Skip test execution (faster)
- `--skip-build` → Skip final build (still checks tests)
- `--only-lint` → Only format and lint (skip type-check, tests, build)

**Context (optional):**
- `before deployment` → Full validation
- `quick check` → Skip expensive steps
- `pre-commit` → Skip build, keep tests

## Usage Examples

✅ **Full validation (deployment):**
```bash
/build-project before deployment
↓ Runs: Prettier → ESLint → TypeCheck → Tests → Build
```

✅ **Quick check (during development):**
```bash
/build-project --skip-tests
↓ Runs: Prettier → ESLint → TypeCheck → (skip tests) → Build
```

✅ **Pre-commit validation:**
```bash
/build-project pre-commit
↓ Runs: Prettier → ESLint → TypeCheck → Tests (no build)
```

✅ **Minimal check:**
```bash
/build-project --only-lint
↓ Runs: Prettier → ESLint (skip type-check, tests, build)
```

❌ **No arguments (runs full):**
```bash
/build-project
↓ Runs complete pipeline: all 5 steps
```

## If Arguments Are Missing

**You run:** `/build-project` (no flags or context)

**I will:**
```
✓ Run FULL validation pipeline (all 5 steps)
✓ Report any failures
✓ Summary of overall status
```

If you want specific behavior:

```
✓ What's your goal?
  → Quick check during development
  → Pre-commit validation
  → Deployment verification
  → Something else?
```

---

## Questions I Will Ask

After validation completes, I will report:

**Formatting & Linting:**
- [ ] Were files reformatted? (how many?)
- [ ] Were lint issues fixed automatically?
- [ ] Are there remaining lint errors?

**Type Safety:**
- [ ] Type check passed?
- [ ] Any type errors to fix?
- [ ] Any type warnings?

**Tests:**
- [ ] All tests passing?
- [ ] Coverage at 100%?
- [ ] Which tests failed (if any)?

**Build:**
- [ ] Build succeeded?
- [ ] Bundle size OK? (<250KB gzipped?)
- [ ] Any build warnings?

**Summary & Next Steps:**
- [ ] Is code ready for commit?
- [ ] Is code ready for deployment?
- [ ] What needs to be fixed?
- [ ] Should we commit/push now?

---

## Validation Pipeline

```
1. Format Check (Prettier)
   ├─ Fix formatting issues
   └─ Report changes

2. Lint Check (ESLint)
   ├─ Fix auto-fixable issues
   └─ Report remaining errors

3. Type Check (TypeScript)
   ├─ Compile without emit
   └─ Report type errors

4. Tests (Jest)
   ├─ Run test suite
   ├─ Verify 100% coverage
   └─ Report failures

5. Build (NextJS)
   ├─ Build for production
   ├─ Optimize bundle
   └─ Report build errors

6. Summary Report
   └─ Overall status
```

## Example Output

```
🔧 Running Build Validation Pipeline...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [1/6] Format Check (Prettier)
  ✨ Fixed: src/shared/ui/Button.tsx
  ✨ Fixed: src/entities/buyer/model/types.ts
  ℹ️  2 files formatted

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [2/6] Lint Check (ESLint)
  ✨ Fixed: 1 unused variable
  ✅ No remaining lint errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [3/6] Type Check (TypeScript)
  ✅ No type errors found
  ℹ️  Checked 42 files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [4/6] Tests (Jest)
  ✅ 156 tests passed
  ✅ Coverage: 100% (lines, branches, functions)
  ⏱️  Completed in 12.5s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [5/6] Build (NextJS)
  ✅ Production build successful
  📦 Bundle size: 245KB (gzipped)
  ⏱️  Completed in 32s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 [6/6] Summary Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All checks passed!

Summary:
  ✨ 2 files formatted
  ✨ 1 lint issue auto-fixed
  ✅ 0 type errors
  ✅ 156/156 tests passed (100% coverage)
  ✅ Build successful (245KB gzipped)

Next Steps:
  1. Review formatting changes: git diff
  2. Commit: git add -A && git commit -m "..."
  3. Push: git push origin [branch]

⏱️  Total time: 45.5s
```

## Failure Example

```
❌ [4/6] Tests (Jest) FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Failed Tests:
  ❌ src/entities/buyer/model/types.test.ts
     Test: "Buyer type validation"
     Error: Expected type to be valid

  ❌ src/shared/ui/Button/Button.test.tsx
     Test: "Button renders with correct variant"
     Error: Cannot find element

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Coverage Report:
  Statements: 98.5% (needed: 100%)
  Branches:   96.2% (needed: 100%)
  Functions:  99.1% (needed: 100%)

❌ Build validation FAILED at step 4/6

Action Required:
  1. Fix failing tests
  2. Improve coverage to 100%
  3. Re-run: /build-project

Tip: Use "npm run test -- --watch" for development
```

## Notes

- **Format Fix:** Prettier automatically fixes formatting
- **Lint Fix:** ESLint auto-fixes most issues (some need manual fix)
- **Type Check:** Requires manual fixes (cannot auto-fix types)
- **Tests:** Must pass with 100% coverage (no auto-fix)
- **Build:** Must complete successfully (no auto-fix)

## When To Use

✅ **Always use before:**
- Pushing to remote
- Creating a commit (recommended)
- Deploying to production
- Merging to main branch

⏩ **Quick check (--skip-build):**
- Pre-commit validation
- During development
- When just checking code quality

## CI/CD Integration

```yaml
# .github/workflows/build.yml
- name: Build Validation
  run: /build-project
```

## Performance Tips

- First run takes ~45s (includes setup)
- Subsequent runs take ~30s
- Use `--skip-build` for quick validation during development
- Run `npm run test:watch` for TDD workflow
