import { TAG_LABELS } from '@/lib/recipe-enums';

interface IOverviewTab {
  description: string | null;
  tags: number[];
}

export const OverviewTab = ({ description, tags }: IOverviewTab) => (
  <div className="px-4 py-5">
    {description && <p className="mb-5 leading-relaxed text-gray-600">{description}</p>}
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600"
          >
            {TAG_LABELS[tag] ?? tag}
          </span>
        ))}
      </div>
    )}
    {!description && tags.length === 0 && (
      <p className="text-sm text-gray-400">No overview available.</p>
    )}
  </div>
);
