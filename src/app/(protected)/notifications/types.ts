export interface INotification {
  id: string;
  type: 'FRIEND_REQUEST' | 'FRIEND_ACCEPTED' | 'COMMENT' | 'RATING' | 'RECIPE_IMPORTED';
  read: boolean;
  createdAt: string;
  referenceId: string | null;
  senderId: string;
  senderUsername: string;
  senderDisplayName: string | null;
}
