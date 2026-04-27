import { AppleIcon, GoogleIcon } from '@/components/icons';

export const SocialsLogin = () => (
  <div className="mb-5 flex flex-col gap-3">
    <button
      disabled
      title="Coming soon"
      className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-solid border-(--border) bg-(--card) py-3 text-sm font-medium opacity-60"
    >
      <GoogleIcon className="h-5 w-5" />
      <span>Continue with Google</span>
    </button>

    <button
      disabled
      title="Coming soon"
      className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-solid border-(--border) bg-(--card) py-3 text-sm font-medium opacity-60"
    >
      <AppleIcon className="h-5 w-5" />
      <span>Continue with Apple</span>
    </button>
  </div>
);
