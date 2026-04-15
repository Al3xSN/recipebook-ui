export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  email: string;
  displayName: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthUser {
  email: string;
  displayName: string | null;
}
