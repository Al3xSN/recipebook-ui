export interface ProfileDto {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface UpdateProfileInfoRequest {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface UpdateProfileInfoResponse {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  usernameChanged: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  status: number;
  detail: string;
}
