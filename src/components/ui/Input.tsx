interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const Input = ({ label, error, id, className = '', ...rest }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={`rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
          error
            ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            : 'border-gray-300 bg-gray-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20'
        } ${className}`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
