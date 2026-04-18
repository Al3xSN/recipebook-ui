'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ApiRequestError } from '@/lib/api';
import { SpinnerIcon, CameraIcon } from '@/components/icons';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type ImageUploadProps = {
  currentImageUrl?: string | null;
  shape?: 'circle' | 'rectangle';
  placeholder?: string;
  onRemove?: () => void;
} & (
  | { uploadUrl: string; onSuccess: (url: string) => void; onFileSelect?: never }
  | { uploadUrl?: never; onSuccess?: never; onFileSelect: (file: File, previewUrl: string) => void }
);

export const ImageUpload = ({
  uploadUrl,
  currentImageUrl,
  shape = 'rectangle',
  placeholder,
  onSuccess,
  onFileSelect,
  onRemove,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayUrl = localPreviewUrl ?? currentImageUrl ?? null;
  const isCircle = shape === 'circle';

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

    if (onFileSelect) {
      onFileSelect(file, objectUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(uploadUrl!, { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        throw new ApiRequestError({ status: res.status, detail: body.detail ?? res.statusText });
      }
      const { url } = (await res.json()) as { url: string };
      URL.revokeObjectURL(objectUrl);
      setLocalPreviewUrl(url);
      onSuccess!(url);
    } catch (err) {
      setLocalPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
      setError(err instanceof ApiRequestError ? err.detail : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const spinner = (
    <span className="absolute inset-0 flex items-center justify-center bg-black/40">
      <SpinnerIcon className="h-6 w-6 animate-spin text-white" />
    </span>
  );

  const changeOverlay = (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover/upload:opacity-100">
      <CameraIcon className="h-5 w-5 text-white" />
      <span className="text-xs font-medium text-white">Change photo</span>
    </span>
  );

  if (isCircle) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="Change photo"
          className="group/upload relative flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-100 text-2xl font-bold text-orange-600 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Profile photo"
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
            />
          ) : (
            (placeholder ?? '')
          )}
          {isUploading ? spinner : null}
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
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="Upload photo"
        className="group/upload relative w-full cursor-pointer overflow-hidden rounded-xl bg-orange-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        <div className="aspect-video w-full">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Recipe photo"
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-orange-200 rounded-xl hover:border-orange-400 transition-colors">
              <CameraIcon className="h-10 w-10 text-orange-300" strokeWidth={1.5} />
              <span className="text-sm text-orange-400">Upload photo</span>
            </span>
          )}
        </div>
        {isUploading ? spinner : displayUrl ? changeOverlay : null}
      </button>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">JPEG, PNG, or WebP — max 2 MB</p>
        {onRemove && displayUrl && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>

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
