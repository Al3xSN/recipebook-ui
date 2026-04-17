import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { ProfileInfoForm } from '../../_components/ProfileInfoForm';
import { ChangePasswordForm } from '../../_components/ChangePasswordForm';
import { AvatarUpload } from '../../_components/AvatarUpload';

export default async function SettingsPage({ params }: { params: Promise<{ username: string }> }) {
  const [session, { username }] = await Promise.all([auth(), params]);

  if (!session?.user?.username || session.user.username !== username) {
    redirect(`/profile/${username}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link
          href={`/profile/${username}`}
          className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-orange-500"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
      </div>

      <div className="flex flex-col gap-6">
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Profile picture</h2>
            <p className="text-sm text-gray-500">Click your avatar to upload a new photo.</p>
          </div>
          <div className="flex justify-center px-6 py-6">
            <AvatarUpload />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-500">Update your display name, username, and bio.</p>
          </div>
          <div className="px-6 py-6">
            <ProfileInfoForm />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Account</h2>
            <p className="text-sm text-gray-500">Change your password.</p>
          </div>
          <div className="px-6 py-6">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
