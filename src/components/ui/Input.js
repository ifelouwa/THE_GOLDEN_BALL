export function Input({ label, type = "text", value, onChange, placeholder, name, required = false, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none"
      />
    </div>
  );
}
