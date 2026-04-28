import UserRow from './UserRow';
import { IIncomingRequestDto } from '@/interfaces/IFriend';

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
    return <p className="py-10 text-center text-sm text-(--text3)">No pending friend requests.</p>;
  }

  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold tracking-wider text-(--text3) uppercase">
        {requests.length} pending
      </p>
      <div className="divide-y divide-(--border)">
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
                    className="rounded-lg bg-(--accent) px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(r.id)}
                    className="rounded-lg border border-(--border) px-4 py-1.5 text-[13px] font-medium text-(--text2) transition-colors hover:border-(--accent) hover:text-(--accent)"
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
