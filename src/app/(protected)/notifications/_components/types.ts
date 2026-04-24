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

export const notificationMessage = (n: INotification): string => {
  const name = n.senderDisplayName ?? n.senderUsername;
  switch (n.type) {
    case 'FRIEND_REQUEST':
      return `${name} sent you a friend request.`;
    case 'FRIEND_ACCEPTED':
      return `${name} accepted your friend request.`;
    case 'COMMENT':
      return `${name} commented on your recipe.`;
    case 'RATING':
      return `${name} rated your recipe.`;
    case 'RECIPE_IMPORTED':
      return `${name} imported one of your recipes.`;
  }
};
