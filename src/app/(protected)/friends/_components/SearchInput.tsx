const SearchInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="relative mb-4">
    <svg
      className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text3)"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full border border-(--border) bg-white py-2.5 pr-4 pl-10 text-[14px] text-(--text) placeholder-(--text3) outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent)"
    />
  </div>
);

export default SearchInput;
