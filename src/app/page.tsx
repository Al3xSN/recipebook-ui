import type { Metadata } from 'next';
import { auth } from '@/auth';
import { HeroSection } from '@/components/home/HeroSection';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'RecipeBook — Discover, save, and share recipes' };

const HomePage = async () => {
  const session = await auth();
  const user = session?.user ?? null;

  if (user) {
    redirect('/recipes');
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <HeroSection />
    </div>
  );
};

export default HomePage;
