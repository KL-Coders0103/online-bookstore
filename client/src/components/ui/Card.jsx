const Card = ({
  children,
  className = "",
  padding = true,
}) => {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-sm ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;