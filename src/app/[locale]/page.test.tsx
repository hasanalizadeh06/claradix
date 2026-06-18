import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      welcome: 'Welcome to Claradix',
      subtitle: 'Modern, accessible, and high-performance frontend',
      description:
        'Claradix is a modern frontend application built with NextJS, TypeScript, and best practices.',
      feature1: 'Fast and optimized',
      feature2: 'Accessible and semantic',
      feature3: 'Type-safe and secure',
      footer: 'Made with care by the Claradix team',
    };
    return translations[key] || key;
  },
}));

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Welcome to Claradix');
  });

  it('renders the subtitle', () => {
    render(<HomePage />);
    const subtitle = screen.getByText(/Modern, accessible, and high-performance/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders the description section', () => {
    render(<HomePage />);
    const description = screen.getByText(/Claradix is a modern frontend application/i);
    expect(description).toBeInTheDocument();
  });

  it('renders all features', () => {
    render(<HomePage />);
    expect(screen.getByText('Fast and optimized')).toBeInTheDocument();
    expect(screen.getByText('Accessible and semantic')).toBeInTheDocument();
    expect(screen.getByText('Type-safe and secure')).toBeInTheDocument();
  });

  it('renders footer text', () => {
    render(<HomePage />);
    const footer = screen.getByText(/Made with care by the Claradix team/i);
    expect(footer).toBeInTheDocument();
  });

  it('has main content area with id', () => {
    render(<HomePage />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('renders semantic HTML structure', () => {
    render(<HomePage />);
    const main = screen.getByRole('main');
    const header = main.querySelector('header');
    const section = main.querySelector('section');
    const footer = main.querySelector('footer');

    expect(header).toBeInTheDocument();
    expect(section).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<HomePage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();

    // No h2 or h3 since this is a simple landing page
    const h2 = document.querySelector('h2');
    const h3 = document.querySelector('h3');
    expect(h2).not.toBeInTheDocument();
    expect(h3).not.toBeInTheDocument();
  });
});
