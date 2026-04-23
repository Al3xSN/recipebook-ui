import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import MobileOnlyGuard from '@/components/ui/MobileOnlyGuard';

export const metadata: Metadata = {
  title: {
    default: 'RecipeBook',
    template: '%s | RecipeBook',
  },
  description: 'Discover, save, and share your favourite recipes.',
  keywords: ['recipes', 'cooking', 'food'],
  authors: [{ name: 'RecipeBook Team' }],
  openGraph: {
    title: 'RecipeBook',
    description: 'Discover, save, and share your favourite recipes.',
    type: 'website',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <MobileOnlyGuard />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
