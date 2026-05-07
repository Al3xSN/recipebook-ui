import { db } from '@/lib/db';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20) || 'user';

export const generateUniqueUsername = async (displayName: string): Promise<string> => {
  const base = slugify(displayName);
  const taken = await db.user.findUnique({ where: { username: base } });
  if (!taken) return base;

  for (let i = 0; i < 10; i++) {
    const candidate = `${base}_${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await db.user.findUnique({ where: { username: candidate } }))) return candidate;
  }

  return `${base}_${Date.now()}`;
};
