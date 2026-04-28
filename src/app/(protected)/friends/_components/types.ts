export interface IFriendDto {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  recipeCount: number;
  mutualFriendCount: number;
}

export interface IIncomingRequestDto {
  id: string;
  senderId: string;
  senderUsername: string;
  senderDisplayName: string | null;
  senderAvatarUrl: string | null;
  senderBio: string | null;
  receiverId: string;
  status: number;
  createdAt: string;
  mutualFriendCount: number;
}

export interface IUserSuggestionDto {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  mutualFriendCount: number;
}

export interface ISentRequestDto {
  id: string;
  receiverId: string;
  receiverUsername: string;
}

export type Tab = 'my-friends' | 'find-people' | 'requests';
