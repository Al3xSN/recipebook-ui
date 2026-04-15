import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { areFriends } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import { RecipeCard } from '../../recipes/_components/RecipeCard';
import { PublicProfileHeader } from './_components/PublicProfileHeader';
import { ProfileStats } from '@/components/ui/ProfileStats';
import type { PublicProfileData } from './_components/PublicProfileHeader';
import type { User } from '@/generated/prisma/client';
import Link from 'next/link';

async function getProfileUser(username: string): Promise<User | null> {
  'use cache';
  cacheTag(`profile-${username}`);
  cacheLife({ stale: 60, revalidate: 300 });

  return db.user.findUnique({ where: { username } });
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth();
  const { username } = await params;

  const target = await getProfileUser(username);
  if (!target) notFound();

  // 404 if caller is blocked by target
  if (session?.user?.id) {
    const blocked = await db.block.findUnique({
      where: { blockerId_blockedId: { blockerId: target.id, blockedId: session.user.id } },
    });
    if (blocked) notFound();
  }

  const currentUserId = session?.user?.id;
  const isOwner = currentUserId === target.id;

  let friendshipStatus: 0 | 1 | 2 | 3 = 0;
  let friendCount = 0;

  if (isOwner) {
    friendCount = await db.friendship.count({
      where: { OR: [{ userAId: target.id }, { userBId: target.id }] },
    });
  } else {
    const isFriend = currentUserId ? await areFriends(currentUserId, target.id) : false;
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
  }

  const visibilityFilter = isOwner
    ? undefined
    : friendshipStatus === 3
      ? { in: [1, 2] as number[] }
      : { equals: 1 };

  const recipes = await db.recipe.findMany({
    where: { userId: target.id, ...(visibilityFilter ? { visibility: visibilityFilter } : {}) },
    include: { ingredients: true, instructions: true, tags: true, user: true },
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
      <PublicProfileHeader
        profile={profile}
        initialFriendshipStatus={friendshipStatus}
        isOwner={isOwner}
      />

      {isOwner && (
        <ProfileStats recipeCount={recipeDtos.length} importedCount={0} friendCount={friendCount} />
      )}

      <h2 className="mb-4 text-base font-semibold text-gray-900">
        {isOwner ? 'My Recipes' : 'Recipes'}
      </h2>

      {recipeDtos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipeDtos.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showVisibility={isOwner}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">
            {isOwner ? 'No recipes yet. Add your first recipe!' : 'No recipes to show.'}
          </p>
          {isOwner && (
            <Link
              href="/recipes/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              Add recipe
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
