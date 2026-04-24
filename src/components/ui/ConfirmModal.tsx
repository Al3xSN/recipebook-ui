'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-semibold text-(--text)">{title}</h2>
        <p className="mt-1 text-sm text-(--text2)">{message}</p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-(--border) py-2 text-sm font-medium text-(--text) transition-colors hover:bg-gray-50"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
