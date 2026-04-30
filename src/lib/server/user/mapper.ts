import { IUserDto } from '@/interfaces/IUser';

export const toUserDto = (user: {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}): IUserDto => ({
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});
