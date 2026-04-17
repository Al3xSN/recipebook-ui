import Link from 'next/link';

interface IProfileStats {
  recipeCount: number;
  importedCount: number;
  friendCount: number;
}

export const ProfileStats = ({ recipeCount, importedCount, friendCount }: IProfileStats) => {
  return (
    <div className="mb-8 grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col items-center py-5">
        <span className="text-2xl font-bold text-gray-900">{recipeCount}</span>
        <span className="text-xs text-gray-500">Recipes</span>
      </div>
      <div className="flex flex-col items-center py-5">
        <span className="text-2xl font-bold text-gray-900">{importedCount}</span>
        <span className="text-xs text-gray-500">Imported</span>
      </div>
      <Link
        href="/friends"
        className="flex flex-col items-center py-5 transition-colors hover:bg-orange-50"
      >
        <span className="text-2xl font-bold text-gray-900">{friendCount}</span>
        <span className="text-xs text-gray-500">Friends</span>
      </Link>
    </div>
  );
};
