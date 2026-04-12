const PLACEHOLDER_COMMENTS = [
  {
    id: 'c1',
    initials: 'JE',
    username: 'julia_eats',
    text: 'Made this last night and the whole family loved it! I added a pinch of chilli flakes for a bit of heat.',
    createdAt: '3 hours ago',
  },
  {
    id: 'c2',
    initials: 'MC',
    username: 'marcelo_chef',
    text: 'Classic recipe, beautifully done. I slow-cooked the sauce for an extra hour and it was incredible.',
    createdAt: '1 day ago',
  },
  {
    id: 'c3',
    initials: 'PK',
    username: 'priya_kitchen',
    text: 'So easy to follow! Substituted the beef with lentils for a vegan version and it worked perfectly.',
    createdAt: '3 days ago',
  },
];

export function CommentList() {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Comments
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({PLACEHOLDER_COMMENTS.length})
        </span>
      </h2>

      {/* Comment list */}
      <div className="mb-6 flex flex-col gap-4">
        {PLACEHOLDER_COMMENTS.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
              {comment.initials}
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{comment.username}</span>
                <span className="text-xs text-gray-400">{comment.createdAt}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add comment form (decorative) */}
      <div className="flex gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
          Me
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Add a comment…"
            rows={3}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              Post comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
