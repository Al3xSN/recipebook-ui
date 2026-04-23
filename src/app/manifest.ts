import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RecipeBook',
    short_name: 'RecipeBook',
    description: 'Discover, save, and share your favourite recipes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF6EC',
    theme_color: '#C8602A',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
