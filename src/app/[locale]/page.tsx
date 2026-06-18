import type { Metadata } from 'next';
import { HomeWidget } from '@/widgets/home-widget';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Claradix - Modern, accessible, and high-performance frontend',
  openGraph: {
    title: 'Home',
    description: 'Welcome to Claradix',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeWidget />;
}
