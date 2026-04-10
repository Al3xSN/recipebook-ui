import { getToken, getRefreshToken, setTokens, clearTokens } from '@/lib/auth-storage';
import type { ApiError } from '@/types/profile';

const BASE_URL = 'http://localhost:5000';

export class AuthError extends Error {
  constructor(message = 'Session expired') {
    super(message);
    this.name = 'AuthError';
  }
}

export class ApiRequestError extends Error {
  status: number;
  detail: string;

  constructor(error: ApiError) {
    super(error.detail);
    this.name = 'ApiRequestError';
    this.status = error.status;
    this.detail = error.detail;
  }
}

async function parseError(res: Response): Promise<ApiRequestError> {
  try {
    const body = (await res.json()) as ApiError;
    return new ApiRequestError({
      status: body.status ?? res.status,
      detail: body.detail ?? res.statusText,
    });
  } catch {
    return new ApiRequestError({ status: res.status, detail: res.statusText });
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw await parseError(res);
  }

  return parseResponse<T>(res);
}

export async function apiAuth<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status !== 401) {
    if (!res.ok) throw await parseError(res);
    return parseResponse<T>(res);
  }

  // 401 — attempt token refresh
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new AuthError();
  }

  const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (refreshRes.status === 401) {
    clearTokens();
    throw new AuthError();
  }

  if (!refreshRes.ok) {
    clearTokens();
    throw new AuthError();
  }

  const refreshData = (await refreshRes.json()) as { token: string; refreshToken: string };
  setTokens(refreshData.token, refreshData.refreshToken);

  // Retry original request with new token
  const retryRes = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      Authorization: `Bearer ${refreshData.token}`,
    },
  });

  if (!retryRes.ok) throw await parseError(retryRes);
  return parseResponse<T>(retryRes);
}
