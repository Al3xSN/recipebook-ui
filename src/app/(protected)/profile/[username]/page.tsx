import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { areFriends } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import { RecipeCard } from '../../recipes/_components/RecipeCard';
import { PublicProfileHeader } from './_components/PublicProfileHeader';
import type { PublicProfileData } from './_components/PublicProfileHeader';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth();
  const { username } = await params;

  const target = await db.user.findUnique({ where: { username } });
  if (!target) notFound();

  // 404 if caller is blocked by target
  if (session?.user?.id) {
    const blocked = await db.block.findUnique({
      where: { blockerId_blockedId: { blockerId: target.id, blockedId: session.user.id } },
    });
    if (blocked) notFound();
  }

  const currentUserId = session?.user?.id;
  const isFriend = currentUserId ? await areFriends(currentUserId, target.id) : false;

  let friendshipStatus: 0 | 1 | 2 | 3 = 0;
  if (isFriend) {
    friendshipStatus = 3;
  } else if (currentUserId) {
    const pending = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: target.id, status: 0 },
          { senderId: target.id, receiverId: currentUserId, status: 0 },
        ],
      },
    });
    if (pending) {
      friendshipStatus = pending.senderId === currentUserId ? 1 : 2;
    }
  }

  const visibilityFilter = isFriend ? { in: [1, 2] as number[] } : { equals: 1 };
  const recipes = await db.recipe.findMany({
    where: { userId: target.id, visibility: visibilityFilter },
    include: { ingredients: true, instructions: true, tags: true },
    orderBy: { createdAt: 'desc' },
  });

  const profile: PublicProfileData = {
    userId: target.id,
    username: target.username,
    displayName: target.displayName,
    bio: target.bio,
    avatarUrl: target.avatarUrl,
  };

  const recipeDtos = recipes.map(toRecipeDto);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PublicProfileHeader profile={profile} initialFriendshipStatus={friendshipStatus} />

      <h2 className="mb-4 text-base font-semibold text-gray-900">Recipes</h2>

      {recipeDtos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipeDtos.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
              <RecipeCard recipe={recipe} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">No recipes to show.</p>
        </div>
      )}
    </div>
  );
}
