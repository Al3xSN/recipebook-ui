import UserRow from './UserRow';
import { IIncomingRequestDto } from './types';

const RequestsTab = ({
  requests,
  onAccept,
  onDecline,
}: {
  requests: IIncomingRequestDto[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) => {
  if (requests.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text3)]">No pending friend requests.</p>
    );
  }

  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold tracking-wider text-[var(--text3)] uppercase">
        {requests.length} pending
      </p>
      <div className="divide-y divide-[var(--border)]">
        {requests.map((r) => {
          const name = r.senderDisplayName ?? r.senderUsername;
          return (
            <UserRow
              key={r.id}
              name={name}
              username={r.senderUsername}
              bio={r.senderBio}
              avatarUrl={r.senderAvatarUrl}
              mutualFriendCount={r.mutualFriendCount}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => onAccept(r.id)}
                    className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(r.id)}
                    className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-[13px] font-medium text-[var(--text2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Decline
                  </button>
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default RequestsTab;
