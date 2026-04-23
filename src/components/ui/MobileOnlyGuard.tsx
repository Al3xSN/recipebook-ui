'use client';

const MobileOnlyGuard = () => (
  <div className="hidden md:flex fixed inset-0 z-[9999] bg-white flex-col items-center justify-center gap-4 text-center p-8">
    <span className="text-6xl">📱</span>
    <h1 className="text-2xl font-bold">Mobile Only</h1>
    <p className="text-gray-500 max-w-xs">
      RecipeBook is designed for mobile devices. Please open it on your phone.
    </p>
  </div>
);

export default MobileOnlyGuard;
