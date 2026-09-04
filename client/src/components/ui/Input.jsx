const Input = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  autoComplete,
  name,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text"
        >
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition
          placeholder:text-text-secondary
          focus:border-primary focus:ring-2 focus:ring-primary/10
          disabled:cursor-not-allowed disabled:bg-soft
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
              : "border-border"
          }`}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;