# 🎨 Component Standards

---

## Component Types & Placement

### UI Components (`shared/ui/`)
Reusable, atomic components with zero business logic.

```tsx
// shared/ui/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} disabled:opacity-50`}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
}
```

### Entity UI Components (`entities/[name]/ui/`)
Components that display entity data.

```tsx
// entities/buyer/ui/BuyerCard.tsx
import { Buyer } from '../model/types';

interface BuyerCardProps {
  buyer: Buyer;
  onSelect?: (id: string) => void;
}

export function BuyerCard({ buyer, onSelect }: BuyerCardProps) {
  return (
    <article className="border rounded-lg p-4" aria-labelledby={`buyer-${buyer.id}`}>
      <h3 id={`buyer-${buyer.id}`}>{buyer.name}</h3>
      <p className="text-slate-600">{buyer.email}</p>
      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(buyer.id)}
          className="mt-2 text-blue-600 hover:underline"
        >
          View Details
        </button>
      )}
    </article>
  );
}
```

### Widget Components (`widgets/[name]/ui/`)
Complex page sections combining features.

```tsx
// widgets/buyer-list-widget/ui/BuyerListWidget.tsx
'use client';

import { useBuyers } from '@/features/buyer-list';
import { BuyerCard } from '@/entities/buyer/ui/BuyerCard';
import { Loading, Error, Empty } from '@/shared/ui';

export function BuyerListWidget() {
  const { data, isLoading, error } = useBuyers();

  if (isLoading) return <Loading />;
  if (error) return <Error message={String((error as any)?.message)} />;
  if (!data?.length) return <Empty message="No buyers found" />;

  return (
    <div className="grid gap-4">
      {data.map(buyer => <BuyerCard key={buyer.id} buyer={buyer} />)}
    </div>
  );
}
```

---

## 📐 Component Props Pattern

```tsx
// ✅ CORRECT: Interface with extends
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, ...props }: ButtonProps) {
  return <button {...props}>{...}</button>;
}

// ✅ CORRECT: React.ComponentProps for flexibility
type DivProps = React.ComponentProps<'div'>;

interface CardProps extends DivProps {
  title: string;
}

// ❌ WRONG: Inline props without interface
export function Button(props: any) { }

// ❌ WRONG: Forgotten to spread rest props
export function Button({ variant, ...props }: ButtonProps) {
  return <button className={variant}>{props.children}</button>;  // Missing {...props}!
}
```

---

## 🔄 Conditional Rendering

```tsx
// ✅ CORRECT: Early returns
export function Component() {
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!data) return <Empty />;

  return <Content data={data} />;
}

// ✅ CORRECT: Ternary for UI variants
<button className={isActive ? 'bg-blue-600' : 'bg-slate-200'}>
  {isActive ? 'Active' : 'Inactive'}
</button>

// ❌ WRONG: render prop without JSX fragment
{isLoading && <Loading />}
{error && <Error />}

// ❌ WRONG: Complex ternaries
{isLoading ? <Loading /> : error ? <Error /> : data ? <Content /> : <Empty />}
```

---

## 🪝 Hook Usage

### Always at Top Level

```tsx
// ✅ CORRECT
export function Component() {
  const { data, isLoading } = useBuyers();
  const { register, handleSubmit } = useForm();
  
  return (...);
}

// ❌ WRONG: Conditional hook call
if (condition) {
  const { data } = useBuyers();  // FORBIDDEN!
}

// ❌ WRONG: Hook in loop
list.map(() => {
  const { data } = useBuyers();  // FORBIDDEN!
})
```

### Hook Dependencies

```tsx
// ✅ CORRECT: Include all dependencies
useEffect(() => {
  handleSearch(query);
}, [query, handleSearch]);

// ✅ CORRECT: Memoize callback if needed
const handleSearch = useCallback((q: string) => {
  // ...
}, [dependency]);

// ❌ WRONG: Empty dependency array when needed
useEffect(() => {
  handleSearch(query);
}, []);  // Query change won't trigger!

// ❌ WRONG: Function in dependency without useCallback
useEffect(() => {
  if (shouldFetch) fetch();
}, [shouldFetch, fetch]);  // fetch reference changes constantly!
```

---

## 📦 Component File Organization

```
Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx          (optional: Storybook)
└── index.ts

// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

---

## 🧪 Testing Components

```tsx
// ✅ CORRECT: User-centric tests
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('button renders and is clickable', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
  
  button.click();
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// ❌ WRONG: Implementation details
test('button has correct className', () => {
  const { container } = render(<Button>Click</Button>);
  expect(container.querySelector('button')).toHaveClass('btn');
});
```

---

## 🎨 Styling with Tailwind

```tsx
// ✅ CORRECT: Tailwind utilities
<button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
  Click me
</button>

// ✅ CORRECT: cn() for conditional classes
import { cn } from '@/shared/lib/cn';

<button
  className={cn(
    'px-4 py-2 font-medium transition-colors',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'secondary' && 'bg-slate-200 text-slate-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  Click me
</button>

// ❌ WRONG: Template string for conditionals
<button className={`px-4 py-2 ${variant === 'primary' ? 'bg-blue-600' : ''}`}>

// ❌ WRONG: Custom CSS when Tailwind exists
<style>
  .btn { background-color: #2563eb; }
</style>
<button className="btn">Click me</button>
```

---

## 🔒 Type Safety

```tsx
// ✅ CORRECT: Proper typing
interface BuyerCardProps {
  buyer: Buyer;
  onSelect?: (id: string) => void;
}

export function BuyerCard({ buyer, onSelect }: BuyerCardProps) {
  return (...);
}

// ❌ WRONG: any type
export function BuyerCard({ buyer }: any) {
  return buyer.name;  // No type checking
}

// ❌ WRONG: Partial typing
export function BuyerCard({ buyer: Buyer }) {  // Not valid TypeScript
  return (...);
}
```

---

## 🚫 Forbidden Patterns (ALWAYS DETECT & FIX)

These patterns break the architecture and are NOT allowed:

```tsx
// ❌ WRONG: Direct axios usage (use apiGet/apiPost instead)
import axios from 'axios';
const data = await axios.get('/api/data');

// ❌ WRONG: Direct apiClient usage (use typed wrappers)
import apiClient from '@/shared/api/client';
const data = await apiClient.get('/api/data');

// ❌ WRONG: Raw useQuery without wrapper (use useApiQuery)
const { data } = useQuery({ queryKey: ['data'], queryFn: () => fetch('...') });

// ❌ WRONG: Hardcoded text without translation
<h1>Welcome</h1>
<button>Click me</button>

// ❌ WRONG: Div as button (use <button> element)
<div onClick={handleClick} role="button">Click me</div>

// ❌ WRONG: Image without alt text
<img src="photo.jpg" />

// ❌ WRONG: Using any type
const data: any = response;
const handleClick: any = () => {};

// ❌ WRONG: Circular imports or wrong layer imports
// entities/ importing from features/
import { useCreateBuyer } from '@/features/create-buyer';
export const buyerApi = { ... };

// ❌ WRONG: Multiple h1 per page
<h1>Title</h1>
<h1>Subtitle</h1>

// ❌ WRONG: Input without label
<input type="email" placeholder="Enter email" />

// ❌ WRONG: Table header without scope
<table>
  <tr>
    <th>Name</th>  {/* Missing scope="col" */}
  </tr>
</table>

// ❌ WRONG: Button without type attribute
<button onClick={handleSubmit}>Submit</button>

// ❌ WRONG: Link with javascript:void(0)
<a href="javascript:void(0)" onClick={handleClick}>Click</a>

// ❌ WRONG: Missing error state handling
const { data, isLoading } = useBuyers();
if (isLoading) return <Loading />;
return <List data={data} />;  // What if error?

// ❌ WRONG: Manual Authorization header (interceptor handles it)
const config = { headers: { Authorization: `Bearer ${token}` } };
const response = await apiClient.get('/api', config);

// ❌ WRONG: Using placeholder as label
<input placeholder="First Name" />
```

---

## ✅ Enforced Patterns (ALWAYS APPLY)

These patterns are required and should be used everywhere:

```tsx
// ✅ CORRECT: Proper 7-layer API pattern
import { apiGet, apiPost } from '@/shared/api/requests';

// Layer 5: Entity API
export const buyerApi = {
  getBuyers: () => apiGet<Buyer[]>('/buyer'),
  createBuyer: (data: CreateBuyerDto) => apiPost<Buyer, CreateBuyerDto>('/buyer', data),
};

// Layer 6: Feature hook
import { useApiQuery } from '@/shared/api/useApi';
export const useBuyers = () =>
  useApiQuery<Buyer[], unknown>(['buyers'], buyerApi.getBuyers);

// Layer 7: Widget component
'use client';
import { useBuyers } from '@/features/buyer-list';
export function BuyersWidget() {
  const { data, isLoading, error } = useBuyers();
  if (isLoading) return <Loading />;
  if (error) return <Error message={String((error as any)?.message)} />;
  if (!data?.length) return <Empty />;
  return <List data={data} />;
}

// ✅ CORRECT: Translation with proper namespace
import { useTranslations } from 'next-intl';
const t = useTranslations('BuyersPage');
<h1>{t('title')}</h1>

// ✅ CORRECT: Semantic button with type
<button type="button" onClick={handleClick} aria-label={t('buttonLabel')}>
  {t('buttonText')}
</button>

// ✅ CORRECT: Image with descriptive alt
<img
  src="buyer.jpg"
  alt={t('buyerImageAlt')}
  width={200}
  height={200}
  loading="lazy"
  decoding="async"
/>

// ✅ CORRECT: Proper component prop typing
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  variant?: 'primary' | 'secondary';
}

export function Card({ title, description, variant = 'primary', ...props }: CardProps) {
  return (
    <article className={styles[variant]} {...props}>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}

// ✅ CORRECT: Single h1 with proper hierarchy
<main>
  <h1>{t('mainTitle')}</h1>
  
  <section aria-labelledby="features-heading">
    <h2 id="features-heading">{t('featuresTitle')}</h2>
    
    <h3>{t('feature1Title')}</h3>
    <p>{t('feature1Description')}</p>
  </section>
</main>

// ✅ CORRECT: Form with accessibility
<form>
  <fieldset>
    <legend>{t('personalInfo')}</legend>
    
    <label htmlFor="email">{t('emailLabel')}</label>
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
      <span id="email-error" role="alert">
        {error.message}
      </span>
    )}
  </fieldset>
</form>

// ✅ CORRECT: Table with proper semantics
<table aria-label={t('salesTable')}>
  <caption>{t('monthlySalesData')}</caption>
  <thead>
    <tr>
      <th scope="col">{t('month')}</th>
      <th scope="col">{t('revenue')}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{t('january')}</td>
      <td>$50,000</td>
    </tr>
  </tbody>
</table>

// ✅ CORRECT: Proper type safety
interface Buyer {
  id: string;
  name: string;
  email: string;
}

type CreateBuyerDto = Omit<Buyer, 'id'>;

const handleCreate = async (data: CreateBuyerDto): Promise<Buyer> => {
  return buyerApi.createBuyer(data);
};

// ✅ CORRECT: All states handled
const { data, isLoading, error } = useBuyers();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data?.length) return <EmptyState />;

return <BuyersList buyers={data} />;

// ✅ CORRECT: Native link with proper href and external handling
<a href="/buyers">View Buyers</a>

<a
  href="https://external.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label={t('externalLinkLabel')}
>
  {t('externalLink')}
</a>
```

---

## ✅ Component Checklist

- [ ] Component placed in correct FSD layer
- [ ] Props interface properly typed
- [ ] Rest props spread in HTML elements
- [ ] All hooks at component top level
- [ ] All states handled (loading, error, empty, data)
- [ ] Semantic HTML used
- [ ] Accessible (labels, ARIA, keyboard nav)
- [ ] All text uses `useTranslations()`
- [ ] Test file present
- [ ] No console warnings
- [ ] No TypeScript errors
- [ ] Index.ts exports the component
- [ ] No forbidden patterns used
- [ ] Enforced patterns followed

---

**Last Updated:** 2026-06-18
