import { Metadata } from 'next';
import './globals.css';
import { MobileOnlyGuard } from '@/components/ui/MobileOnlyGuard';
import { Providers } from '@/components/Providers';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <MobileOnlyGuard />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
