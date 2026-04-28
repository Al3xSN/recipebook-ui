'use client';

interface ITab {
  id: string;
  label: string;
  count?: number;
}

interface ITabBarProps {
  tabs: ITab[];
  active: string;
  onChange: (id: string) => void;
}

export const TabBar = ({ tabs, active, onChange }: ITabBarProps) => {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-3 text-sm font-medium transition-colors ${
            active === tab.id
              ? "text-orange-500 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:content-['']"
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                active === tab.id ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
