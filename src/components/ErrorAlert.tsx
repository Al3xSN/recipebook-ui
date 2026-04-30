interface ErrorAlertProps {
  message: string | null;
  className?: string;
}

export const ErrorAlert = ({ message, className = '' }: ErrorAlertProps) => {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={`rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 ${className}`}
    >
      {message}
    </p>
  );
};
