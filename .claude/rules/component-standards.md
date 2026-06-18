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

---

**Last Updated:** 2026-06-18
