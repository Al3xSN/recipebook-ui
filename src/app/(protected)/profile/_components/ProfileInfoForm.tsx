'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/auth-context';
import { apiAuth, AuthError, ApiRequestError } from '@/lib/api';
import type {
  ProfileDto,
  UpdateProfileInfoRequest,
  UpdateProfileInfoResponse,
} from '@/types/profile';

export function ProfileInfoForm() {
  const router = useRouter();
  const auth = useAuth();

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [formData, setFormData] = useState<UpdateProfileInfoRequest>({
    username: '',
    displayName: null,
    bio: null,
    avatarUrl: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiAuth<ProfileDto>('/profile');
        setProfile(data);
        setFormData({
          username: data.username,
          displayName: data.displayName,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        });
      } catch (err) {
        if (err instanceof AuthError) {
          router.replace('/login');
        } else if (err instanceof ApiRequestError) {
          setFetchError(err.detail);
        } else {
          setFetchError('Failed to load profile.');
        }
      } finally {
        setIsFetchLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  function handleChange(field: keyof UpdateProfileInfoRequest, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value || null }));
  }

  function handleCancel() {
    if (profile) {
      setFormData({
        username: profile.username,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
      });
    }
    setSaveError(null);
    setIsEditing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaveLoading(true);

    try {
      const response = await apiAuth<UpdateProfileInfoResponse>('/profile/info', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (response.token && response.refreshToken) {
        auth.updateUser(
          { email: auth.user!.email, displayName: response.displayName },
          response.token,
          response.refreshToken,
        );
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: response.username,
              displayName: response.displayName,
              bio: response.bio,
              avatarUrl: response.avatarUrl,
            }
          : prev,
      );

      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/login');
      } else if (err instanceof ApiRequestError) {
        setSaveError(err.detail);
      } else {
        setSaveError('Failed to save profile.');
      }
    } finally {
      setIsSaveLoading(false);
    }
  }

  if (isFetchLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Loading profile…</p>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6">
        <p className="text-sm text-red-600">{fetchError}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Profile info</h2>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {saveSuccess && !isEditing && (
        <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Profile updated successfully.
        </p>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {saveError && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {saveError}
            </p>
          )}
          <Input
            id="username"
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
          <Input
            id="displayName"
            label="Display name"
            type="text"
            value={formData.displayName ?? ''}
            onChange={(e) => handleChange('displayName', e.target.value)}
          />
          <Input
            id="bio"
            label="Bio"
            type="text"
            value={formData.bio ?? ''}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
          <Input
            id="avatarUrl"
            label="Avatar URL"
            type="url"
            value={formData.avatarUrl ?? ''}
            onChange={(e) => handleChange('avatarUrl', e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isSaveLoading}>
              Save changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSaveLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="flex flex-col gap-3 text-sm">
          <ProfileField label="Username" value={profile?.username} />
          <ProfileField label="Display name" value={profile?.displayName} />
          <ProfileField label="Bio" value={profile?.bio} />
          <ProfileField label="Avatar URL" value={profile?.avatarUrl} />
        </dl>
      )}
    </section>
  );
}

function ProfileField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-900">
        {value ?? <span className="italic text-gray-400">Not set</span>}
      </dd>
    </div>
  );
}
