'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ApiRequestError } from '@/lib/api';
import { SpinnerIcon } from '@/components/icons';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const AvatarUpload = () => {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = session?.user?.displayName ?? session?.user?.username ?? '';
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = localPreviewUrl ?? session?.user?.avatarUrl ?? null;

  const triggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File must be 2 MB or smaller.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new ApiRequestError({ status: res.status, detail: body.detail ?? res.statusText });
      }
      const { url } = (await res.json()) as { url: string };
      URL.revokeObjectURL(objectUrl);
      setLocalPreviewUrl(url);
      await updateSession({ avatarUrl: url });
    } catch (err) {
      setLocalPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
      setError(err instanceof ApiRequestError ? err.detail : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={triggerUpload}
        disabled={isUploading}
        aria-label="Change photo"
        className="relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-100 text-xl font-bold text-orange-600 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile photo"
            width={64}
            height={64}
            className="h-16 w-16 object-cover"
          />
        ) : (
          initials
        )}
        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <SpinnerIcon className="h-5 w-5 animate-spin text-white" />
          </span>
        )}
      </button>

      <div>
        <p className="font-semibold text-(--text)">{displayName}</p>
        <button
          type="button"
          onClick={triggerUpload}
          disabled={isUploading}
          className="mt-1.5 rounded-lg border border-(--border) bg-white px-3 py-1.5 text-sm font-medium text-(--text2) transition-colors hover:bg-(--bg2) focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          Change photo
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

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
