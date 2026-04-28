export const MobileOnlyGuard = () => (
  <div className="fixed inset-0 z-9999 hidden flex-col items-center justify-center gap-4 bg-white p-8 text-center md:flex">
    <span className="text-6xl">📱</span>
    <h1 className="text-2xl font-bold">Mobile Only</h1>
    <p className="max-w-xs text-gray-500">
      RecipeBook is designed for mobile devices. Please open it on your phone.
    </p>
  </div>
);
