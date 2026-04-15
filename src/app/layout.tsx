import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
