export interface IProfileDto {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface IUpdateProfileInfoRequest {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface IUpdateProfileInfoResponse {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  usernameChanged: boolean;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IApiError {
  status: number;
  detail: string;
}
