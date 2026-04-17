'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ApiRequestError } from '@/lib/api';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const AvatarUpload = () => {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayUrl = previewUrl ?? session?.user?.avatarUrl ?? null;
  const displayName = session?.user?.displayName ?? session?.user?.username ?? '';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are supported.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File must be 2 MB or smaller.');
      return;
    }

    setIsUploading(true);

    try {
      const form = new FormData();
      form.append('avatar', file);

      const res = await fetch('/api/profile/avatar', { method: 'POST', body: form });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new ApiRequestError({ status: res.status, detail: body.detail ?? res.statusText });
      }

      const { avatarUrl: newUrl } = (await res.json()) as { avatarUrl: string };

      await updateSession({ avatarUrl: newUrl });

      setPreviewUrl(newUrl);
    } catch (err) {
      setPreviewUrl(null);
      if (err instanceof ApiRequestError) {
        setError(err.detail);
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="Change profile picture"
        className="relative flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-100 text-2xl font-bold text-orange-600 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={displayName}
            width={96}
            height={96}
            className="h-24 w-24 object-cover"
          />
        ) : (
          initials
        )}

        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <svg
              className="h-6 w-6 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
        )}
      </button>

      <p className="text-xs text-gray-500">JPEG, PNG, or WebP — max 2 MB</p>

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  );
};
