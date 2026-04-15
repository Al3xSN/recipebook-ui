import type { Metadata } from 'next';
import { ProfileInfoForm } from './_components/ProfileInfoForm';
import { ChangePasswordForm } from './_components/ChangePasswordForm';

export const metadata: Metadata = { title: 'Profile' };

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">Your Profile</h1>
      <div className="flex flex-col gap-8">
        <ProfileInfoForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
