export interface IUserDto {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

export interface ICreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
}

export interface IUpdateUserProfileData {
  username?: string;
  displayName?: string | null;
  bio?: string | null;
}
