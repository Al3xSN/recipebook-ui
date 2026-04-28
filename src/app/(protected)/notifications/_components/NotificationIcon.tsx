import {
  CommentIcon,
  FriendAcceptedIcon,
  FriendRequestIcon,
  RatingIcon,
  RecipeImportedIcon,
} from '@/components/icons';
import { INotification } from '../types';

export const NotificationIcon = ({ type }: { type: INotification['type'] }) => {
  const notificationIcons = {
    FRIEND_REQUEST: <FriendRequestIcon className="h-5 w-5" />,
    FRIEND_ACCEPTED: <FriendAcceptedIcon className="h-5 w-5" />,
    COMMENT: <CommentIcon className="h-5 w-5" />,
    RATING: <RatingIcon className="h-5 w-5" />,
    RECIPE_IMPORTED: <RecipeImportedIcon className="h-5 w-5" />,
  };

  return notificationIcons[type];
};
