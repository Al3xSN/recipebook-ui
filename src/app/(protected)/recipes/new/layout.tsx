import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Recipe' };

const NewRecipeLayout = ({ children }: { children: React.ReactNode }) => children;

export default NewRecipeLayout;
