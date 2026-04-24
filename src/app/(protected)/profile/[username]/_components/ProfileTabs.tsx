'use client';

export type ProfileTab = 'recipes' | 'saved' | 'about';

interface IProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'recipes', label: 'Recipes' },
  { id: 'saved', label: 'Saved' },
  { id: 'about', label: 'About' },
];

export const ProfileTabs = ({ activeTab, onTabChange }: IProfileTabsProps) => {
  return (
    <div className="sticky top-0 z-10 flex border-b border-(--border) bg-(--card)">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-(--accent) font-semibold text-(--accent)'
              : 'text-(--text2) hover:text-(--text)'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
