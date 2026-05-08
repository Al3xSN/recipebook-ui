import { TAG_LABELS } from '@/lib/recipe-enums';

interface IOverviewTab {
  description: string | null;
  tags: number[];
}

export const OverviewTab = ({ description, tags }: IOverviewTab) => (
  <div className="px-4 py-5">
    {description && <p className="mb-5 leading-relaxed text-(--text2)">{description}</p>}
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-(--border) px-3 py-1 text-sm text-(--text2)"
          >
            {TAG_LABELS[tag] ?? tag}
          </span>
        ))}
      </div>
    )}
    {!description && tags.length === 0 && (
      <p className="text-sm text-(--text3)">No overview available.</p>
    )}
  </div>
);
