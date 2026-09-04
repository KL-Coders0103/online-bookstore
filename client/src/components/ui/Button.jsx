const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  onClick,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover",
    secondary:
      "border border-border bg-surface text-text hover:bg-soft",
    accent:
      "bg-accent text-white hover:bg-accent-hover",
    danger:
      "bg-red-700 text-white hover:bg-red-800",
    ghost:
      "text-text-secondary hover:bg-soft hover:text-text",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;