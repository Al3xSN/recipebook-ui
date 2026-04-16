import Link from 'next/link';
import { ProfileInfoForm } from '../../_components/ProfileInfoForm';
import { ChangePasswordForm } from '../../_components/ChangePasswordForm';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/profile/me"
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
        {/* Profile section */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-500">Update your display name, username, and bio.</p>
          </div>
          <div className="px-6 py-6">
            <ProfileInfoForm />
          </div>
        </section>

        {/* Account section */}
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
