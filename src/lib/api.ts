import type { ApiError } from '@/types/profile';

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

/**
 * Fetch wrapper for all API routes (/api/*).
 * Session cookie is sent automatically for same-origin requests.
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) throw await parseError(res);
  return parseResponse<T>(res);
}
