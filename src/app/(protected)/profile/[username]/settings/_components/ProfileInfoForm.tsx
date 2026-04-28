'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { IUpdateProfileInfoRequest } from '@/interfaces/IProfile';
import { NotificationsSettings } from './NotificationsSettings';
import { IUserDto } from '@/interfaces/IUser';
import { updateProfileInfo } from '../actions';

interface IProfileInfoForm {
  user: IUserDto | null;
}

export const ProfileInfoForm = ({ user }: IProfileInfoForm) => {
  const { data: session, update: updateSession } = useSession();

  const [formData, setFormData] = useState<IUpdateProfileInfoRequest>({
    username: user!.username,
    displayName: user!.displayName,
    bio: user!.bio,
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    comments: true,
    ratings: true,
    followers: false,
    newsletter: true,
  });

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      const result = await updateProfileInfo(formData);

      if (result.error) {
        setSaveError(result.error);
        return;
      }

      if (result.data!.usernameChanged) {
        await updateSession({
          username: result.data!.username,
          displayName: result.data!.displayName,
        });
      }

      setSaveSuccess(true);
    } finally {
      setIsSaveLoading(false);
    }
  };

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
        <label className="mb-1 block text-xs font-semibold tracking-wider text-(--text3) uppercase">
          Full Name
        </label>

        <input
          id="displayName"
          type="text"
          value={formData.displayName ?? ''}
          onChange={(e) => handleChange('displayName', e.target.value)}
          className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent)"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-wider text-(--text3) uppercase">
          Username
        </label>

        <div className="flex overflow-hidden rounded-lg border border-(--border) bg-white transition-colors focus-within:border-(--accent) focus-within:ring-1 focus-within:ring-(--accent)">
          <span className="flex items-center border-r border-(--border) bg-(--bg2) px-3 text-sm text-(--text3)">
            @
          </span>

          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            className="flex-1 bg-transparent px-3 py-2.5 text-base text-(--text) outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-wider text-(--text3) uppercase">
          Bio
        </label>

        <textarea
          id="bio"
          value={formData.bio ?? ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={3}
          className={`w-full resize-none rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent)`}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-wider text-(--text3) uppercase">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={session?.user?.email ?? ''}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-(--border) bg-(--bg2) px-3 py-2.5 text-base text-(--text3) outline-none"
        />
      </div>

      <hr className="border-(--border)" />

      <NotificationsSettings
        notifications={notifications}
        toggleNotification={toggleNotification}
      />

      <Button type="submit" isLoading={isSaveLoading} className="w-full">
        Save changes
      </Button>
    </form>
  );
};
