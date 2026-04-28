import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { areFriends, getFriendCount, getPendingRequest } from '@/lib/server/friends';
import { getUserByUsername } from '@/lib/server/user';
import { FriendshipStatus } from '@/enums/FriendshipStatus';
import { ProfileBanner } from './_components/ProfileBanner';
import { ProfileTabsSection } from './_components/ProfileTabsSection';
import { getRecipesByUserIdAsync } from '@/lib/server/recipe';

export default async function ProfilePage(props: PageProps<'/profile/[username]'>) {
  const session = await auth();
  const { username } = await props.params;
  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    notFound();
  }

  const currentUserId = session?.user?.id;
  const isOwner = currentUserId === profileUser.id;

  const resolveFriendshipStatus = async (): Promise<FriendshipStatus> => {
    if (isOwner || !currentUserId) {
      return FriendshipStatus.NotFriends;
    }

    const isFriend = await areFriends(currentUserId, profileUser.id);
    if (isFriend) {
      return FriendshipStatus.Friends;
    }

    const pending = await getPendingRequest(currentUserId, profileUser.id);
    if (!pending) {
      return FriendshipStatus.NotFriends;
    }

    return pending.senderId === currentUserId
      ? FriendshipStatus.PendingOutgoing
      : FriendshipStatus.PendingIncoming;
  };

  const [friendCount, friendshipStatus] = await Promise.all([
    getFriendCount(profileUser.id),
    resolveFriendshipStatus(),
  ]);

  const recipes = await getRecipesByUserIdAsync(profileUser.id, isOwner, friendshipStatus);

  return (
    <div className="mx-auto max-w-5xl">
      <ProfileBanner
        profile={profileUser}
        isOwner={isOwner}
        initialFriendshipStatus={friendshipStatus}
        recipeCount={recipes.length}
        friendCount={friendCount}
      />

      <ProfileTabsSection
        profileBio={profileUser.bio}
        profileCreatedAt={profileUser.createdAt}
        recipes={recipes}
        isOwner={isOwner}
      />
    </div>
  );
}
