interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-4 py-12">
      {/* Brand lockup */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center rounded-2xl bg-orange-500 p-3 text-white shadow-md">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-900">RecipeBook</span>
        <span className="text-sm text-gray-500">
          Discover, save, and share your favourite recipes.
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
}
