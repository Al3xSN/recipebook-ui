import { IApiError } from '@/interfaces/IProfile';

export class ApiRequestError extends Error {
  status: number;
  detail: string;

  constructor(error: IApiError) {
    super(error.detail);
    this.name = 'ApiRequestError';
    this.status = error.status;
    this.detail = error.detail;
  }
}

const parseError = async (res: Response): Promise<ApiRequestError> => {
  try {
    const body = (await res.json()) as IApiError;
    return new ApiRequestError({
      status: body.status ?? res.status,
      detail: body.detail ?? res.statusText,
    });
  } catch {
    return new ApiRequestError({ status: res.status, detail: res.statusText });
  }
};

const parseResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
};

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) throw await parseError(res);
  return parseResponse<T>(res);
};
