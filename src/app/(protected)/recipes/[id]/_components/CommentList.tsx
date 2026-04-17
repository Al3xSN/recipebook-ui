'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { CommentListSkeleton } from './CommentListSkeleton';

interface ICommentDto {
  id: string;
  recipeId: string;
  authorUserId: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: string;
}

interface ICommentList {
  recipeId: string;
}

export const CommentList = ({ recipeId }: ICommentList) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<ICommentDto[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ICommentDto[]>(`/api/recipes/${recipeId}/comments`)
      .then(setComments)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [recipeId]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const comment = await apiFetch<ICommentDto>(`/api/recipes/${recipeId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: text.trim() }),
      });
      setComments((prev) => [...prev, comment]);
      setText('');
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.detail);
      else setError('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
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
  const initials = (username: string) => username.slice(0, 2).toUpperCase();

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Comments
        {!isLoading && (
          <span className="ml-2 text-sm font-normal text-gray-400">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      {isLoading ? (
        <CommentListSkeleton />
      ) : (
        <div className="mb-6 flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                {initials(comment.authorUsername)}
              </div>
              <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.authorUsername}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
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
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
          )}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handlePost} className="flex gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
          {session?.user?.username ? initials(session.user.username) : 'Me'}
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting…' : 'Post comment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
