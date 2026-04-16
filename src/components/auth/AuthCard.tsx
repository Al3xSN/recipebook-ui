interface IAuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: IAuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-orange-50 px-4 pb-12 pt-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
}
