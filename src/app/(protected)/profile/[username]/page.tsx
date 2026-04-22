import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { areFriends } from '@/lib/server/friendship-helpers';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import { getUserByUsername } from '@/lib/server/user';
import { Visibility, FriendRequestStatus } from '@generated/prisma/client';
import { FriendshipStatus } from '@/enums/FriendshipStatus';
import { ProfileContent } from './_components/ProfileContent';
import { RecipesTab } from './_components/RecipesTab';

export default async function ProfilePage(props: PageProps<'/profile/[username]'>) {
  const session = await auth();
  const { username } = await props.params;
  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    notFound();
  }

  const currentUserId = session?.user?.id;
  const isOwner = currentUserId === profileUser.id;

  const friendCount = await db.friendRequest.count({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: profileUser.id }, { receiverId: profileUser.id }],
    },
  });

  let friendshipStatus = FriendshipStatus.NotFriends;

  if (!isOwner && currentUserId) {
    const isFriend = await areFriends(currentUserId, profileUser.id);
    if (isFriend) {
      friendshipStatus = FriendshipStatus.Friends;
    } else {
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
    include: {
      ingredients: true,
      instructions: true,
      tags: true,
      user: true,
      ratings: { select: { value: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const recipeDtos = recipes.map(toRecipeDto);

  const profile = {
    userId: profileUser.id,
    username: profileUser.username,
    displayName: profileUser.displayName,
    bio: profileUser.bio,
    avatarUrl: profileUser.avatarUrl,
    createdAt: profileUser.createdAt.toISOString(),
  };

  return (
    <ProfileContent
      profile={profile}
      isOwner={isOwner}
      initialFriendshipStatus={friendshipStatus}
      recipeCount={recipeDtos.length}
      friendCount={friendCount}
      recipesContent={
        <RecipesTab recipes={recipeDtos} isOwner={isOwner} currentUserId={currentUserId} />
      }
    />
  );
}
