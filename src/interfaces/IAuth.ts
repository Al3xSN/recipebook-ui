export interface IAuthResponseDto {
  token: string;
  refreshToken: string;
  email: string;
  displayName: string | null;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface IRefreshRequest {
  refreshToken: string;
}

export interface IAuthUser {
  email: string;
  displayName: string | null;
}
