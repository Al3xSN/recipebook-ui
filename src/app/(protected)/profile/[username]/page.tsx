import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { areFriends } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import { RecipeCard } from '../../recipes/_components/RecipeCard';
import { IProfileData, ProfileHeader } from './_components/ProfileHeader';
import { ProfileStats } from '@/components/ui/ProfileStats';
import { Visibility, FriendRequestStatus, type User } from '@generated/prisma/client';
import Link from 'next/link';
import { FriendshipStatus } from '@/enums/FriendshipStatus';

async function getProfileUser(username: string): Promise<User | null> {
  return db.user.findUnique({ where: { username } });
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth();
  const { username } = await params;

  const profileUser = await getProfileUser(username);

  if (!profileUser) {
    notFound();
  }

  const currentUserId = session?.user?.id;
  const isOwner = currentUserId === profileUser.id;

  let friendshipStatus = FriendshipStatus.NotFriends;
  let friendCount = 0;

  if (isOwner) {
    friendCount = await db.friendRequest.count({
      where: {
        status: FriendRequestStatus.ACCEPTED,
        OR: [{ senderId: profileUser.id }, { receiverId: profileUser.id }],
      },
    });
  } else {
    const isFriend = currentUserId ? await areFriends(currentUserId, profileUser.id) : false;
    if (isFriend) {
      friendshipStatus = FriendshipStatus.Friends;
    } else if (currentUserId) {
      const pending = await db.friendRequest.findFirst({
        where: {
          OR: [
            {
              senderId: currentUserId,
              receiverId: profileUser.id,
              status: FriendRequestStatus.PENDING,
            },
            {
              senderId: profileUser.id,
              receiverId: currentUserId,
              status: FriendRequestStatus.PENDING,
            },
          ],
        },
      });

      if (pending) {
        friendshipStatus =
          pending.senderId === currentUserId
            ? FriendshipStatus.PendingOutgoing
            : FriendshipStatus.PendingIncoming;
      }
    }
  }

  const visibilityFilter = isOwner
    ? undefined
    : friendshipStatus === FriendshipStatus.Friends
      ? { in: [Visibility.PUBLIC, Visibility.FRIENDS_ONLY] }
      : { equals: Visibility.PUBLIC };

  const recipes = await db.recipe.findMany({
    where: {
      userId: profileUser.id,
      ...(visibilityFilter ? { visibility: visibilityFilter } : {}),
    },
    include: { ingredients: true, instructions: true, tags: true, user: true },
    orderBy: { createdAt: 'desc' },
  });

  const profile: IProfileData = {
    userId: profileUser.id,
    username: profileUser.username,
    displayName: profileUser.displayName,
    bio: profileUser.bio,
    avatarUrl: profileUser.avatarUrl,
  };

  const recipeDtos = recipes.map(toRecipeDto);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <ProfileHeader
        profile={profile}
        initialFriendshipStatus={friendshipStatus}
        isOwner={isOwner}
      />

      <ProfileStats recipeCount={recipeDtos.length} importedCount={0} friendCount={friendCount} />

      <h2 className="mb-4 text-base font-semibold text-gray-900">
        {isOwner ? 'My Recipes' : 'Recipes'}
      </h2>

      {recipeDtos.length > 0 && (
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
      )}

      {recipeDtos.length == 0 && (
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
