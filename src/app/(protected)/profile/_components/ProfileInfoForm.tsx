'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { apiFetch, ApiRequestError } from '@/lib/api';
import {
  IProfileDto,
  IUpdateProfileInfoRequest,
  IUpdateProfileInfoResponse,
} from '@/interfaces/IProfile';

const NOTIFICATIONS = [
  { id: 'comments', label: 'New comments on your recipes' },
  { id: 'ratings', label: 'New ratings received' },
  { id: 'followers', label: 'New followers' },
  { id: 'newsletter', label: 'Weekly recipe newsletter' },
];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1 block text-xs font-semibold tracking-wider text-[var(--text3)] uppercase">
    {children}
  </label>
);

const fieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-base text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]';

export const ProfileInfoForm = () => {
  const { data: session, update: updateSession } = useSession();

  const [profile, setProfile] = useState<IProfileDto | null>(null);
  const [formData, setFormData] = useState<IUpdateProfileInfoRequest>({
    username: '',
    displayName: null,
    bio: null,
    avatarUrl: null,
  });
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    comments: true,
    ratings: true,
    followers: false,
    newsletter: true,
  });
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<IProfileDto>('/api/profile');
        setProfile(data);
        setFormData({
          username: data.username,
          displayName: data.displayName,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        });
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setFetchError(err.detail);
        } else {
          setFetchError('Failed to load profile.');
        }
      } finally {
        setIsFetchLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof IUpdateProfileInfoRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value || null }));
  };

  const toggleNotification = (id: string) =>
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaveLoading(true);

    try {
      const response = await apiFetch<IUpdateProfileInfoResponse>('/api/profile/info', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (response.usernameChanged) {
        await updateSession({ username: response.username, displayName: response.displayName });
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
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSaveError(err.detail);
      } else {
        setSaveError('Failed to save profile.');
      }
    } finally {
      setIsSaveLoading(false);
    }
  };

  if (isFetchLoading) {
    return <p className="text-sm text-[var(--text2)]">Loading profile…</p>;
  }

  if (fetchError) {
    return <p className="text-sm text-red-600">{fetchError}</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {saveSuccess && (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Profile updated successfully.
        </p>
      )}
      {saveError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {saveError}
        </p>
      )}

      <div>
        <FieldLabel>Full Name</FieldLabel>
        <input
          id="displayName"
          type="text"
          value={formData.displayName ?? ''}
          onChange={(e) => handleChange('displayName', e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <FieldLabel>Username</FieldLabel>
        <div className="flex overflow-hidden rounded-lg border border-[var(--border)] bg-white transition-colors focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]">
          <span className="flex items-center border-r border-[var(--border)] bg-[var(--bg2)] px-3 text-sm text-[var(--text3)]">
            @
          </span>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            className="flex-1 bg-transparent px-3 py-2.5 text-base text-[var(--text)] outline-none"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Bio</FieldLabel>
        <textarea
          id="bio"
          value={formData.bio ?? ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>
        <input
          id="email"
          type="email"
          value={session?.user?.email ?? ''}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--bg2)] px-3 py-2.5 text-base text-[var(--text3)] outline-none"
        />
      </div>

      <hr className="border-[var(--border)]" />

      <h2 className="text-base font-semibold text-[var(--text)]">Notifications</h2>

      <div className="-mt-2 flex flex-col">
        {NOTIFICATIONS.map(({ id, label }, i) => (
          <div
            key={id}
            className={`flex items-center justify-between py-3 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
          >
            <span className="text-sm text-[var(--text)]">{label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={notifications[id]}
              onClick={() => toggleNotification(id)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:outline-none ${notifications[id] ? 'bg-[var(--accent)]' : 'bg-gray-200'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform duration-200 ${notifications[id] ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button type="submit" isLoading={isSaveLoading} className="w-full">
        Save changes
      </Button>
    </form>
  );
};
