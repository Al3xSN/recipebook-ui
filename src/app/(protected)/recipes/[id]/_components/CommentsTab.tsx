'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { StarIcon } from '@/components/icons';

interface ICommentDto {
  id: string;
  recipeId: string;
  authorUserId: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: string;
}

const AVATAR_COLORS = [
  'bg-orange-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-teal-400',
  'bg-red-400',
  'bg-yellow-400',
];

const avatarColor = (username: string) =>
  AVATAR_COLORS[username.charCodeAt(0) % AVATAR_COLORS.length];

const initials = (username: string) => username.slice(0, 2).toUpperCase();

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

interface ICommentsTab {
  recipeId: string;
  isOwner: boolean;
}

export const CommentsTab = ({ recipeId, isOwner }: ICommentsTab) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<ICommentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingDone, setRatingDone] = useState(false);

  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ICommentDto[]>(`/api/recipes/${recipeId}/comments`)
      .then(setComments)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [recipeId]);

  const handleRate = async (value: number) => {
    setSelectedStar(value);
    setRatingError(null);
    setIsRating(true);
    try {
      await apiFetch(`/api/recipes/${recipeId}/ratings`, {
        method: 'POST',
        body: JSON.stringify({ value }),
      });
      setRatingDone(true);
    } catch (err) {
      if (err instanceof ApiRequestError) setRatingError(err.detail);
    } finally {
      setIsRating(false);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setCommentError(null);
    setIsPosting(true);
    try {
      const comment = await apiFetch<ICommentDto>(`/api/recipes/${recipeId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: text.trim() }),
      });
      setComments((prev) => [...prev, comment]);
      setText('');
    } catch (err) {
      if (err instanceof ApiRequestError) setCommentError(err.detail);
      else setCommentError('Failed to post comment.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await apiFetch(`/api/recipes/${recipeId}/comments/${commentId}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // ignore
    }
  };

  const currentUserId = session?.user?.id;

  return (
    <div className="px-4 py-5">
      {!isOwner && (
        <div className="mb-6 rounded-2xl bg-[#f5ede8] p-4">
          <p className="mb-3 text-sm font-semibold text-gray-800">Leave a review</p>

          {/* Star rating */}
          <div className="mb-4 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => !ratingDone && handleRate(star)}
                onMouseEnter={() => !ratingDone && setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={isRating || ratingDone}
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                className="transition-transform hover:scale-110 disabled:cursor-default"
              >
                <StarIcon
                  className={`h-7 w-7 transition-colors ${
                    star <= (hoveredStar || selectedStar) ? 'text-orange-500' : 'text-gray-300'
                  }`}
                  fill={star <= (hoveredStar || selectedStar) ? 'currentColor' : 'none'}
                />
              </button>
            ))}
            {ratingDone && <span className="ml-2 text-sm text-orange-500">Thanks for rating!</span>}
            {ratingError && <p className="ml-2 text-sm text-red-500">{ratingError}</p>}
          </div>

          {/* Comment form */}
          <form onSubmit={handlePost}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base transition-colors outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
            {commentError && <p className="mt-1 text-xs text-red-500">{commentError}</p>}
            <button
              type="submit"
              disabled={isPosting || !text.trim()}
              className="mt-3 w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {isPosting ? 'Posting…' : 'Post review'}
            </button>
          </form>
        </div>
      )}

      {/* Comment list */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-[#f5ede8] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(comment.authorUsername)}`}
                  >
                    {initials(comment.authorUsername)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{comment.authorUsername}</p>
                    <p className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</p>
                  </div>
                </div>
                {comment.authorUserId === currentUserId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
