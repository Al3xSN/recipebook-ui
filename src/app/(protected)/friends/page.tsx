import type { Metadata } from 'next';
import { auth } from '@/auth';
import {
  getFriends,
  getIncomingRequests,
  getSentRequests,
  getFriendSuggestions,
} from '@/lib/server/friends';
import { FriendsContent } from './_components/FriendsContent';

export const metadata: Metadata = { title: 'Friends' };

const FriendsPage = async () => {
  const session = await auth();
  const userId = session!.user.id;

  const [friends, requests, suggestions, sentRequests] = await Promise.all([
    getFriends(userId),
    getIncomingRequests(userId),
    getFriendSuggestions(userId),
    getSentRequests(userId),
  ]);

  return (
    <FriendsContent
      initialFriends={friends}
      initialRequests={requests}
      initialSuggestions={suggestions}
      initialSentReceiverIds={sentRequests.map((r) => r.receiverId)}
    />
  );
};

export default FriendsPage;
