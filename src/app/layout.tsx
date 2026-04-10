import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
