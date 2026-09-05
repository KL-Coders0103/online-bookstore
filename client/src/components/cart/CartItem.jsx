import { Link } from "react-router-dom";

import useCart from "../../hooks/useCart";

const CartItem = ({ item }) => {
  const book = item.book;

  const {
    updateCartItem,
    removeFromCart,
    updating,
    removing,
  } = useCart();

  if (!book) {
    return null;
  }

  const handleDecrease = async () => {
    if (item.quantity <= 1 || updating || removing) {
      return;
    }

    await updateCartItem(book._id, item.quantity - 1);
  };

  const handleIncrease = async () => {
    if (item.quantity >= book.stock || updating || removing) {
      return;
    }

    await updateCartItem(book._id, item.quantity + 1);
  };

  const handleRemove = async () => {
    if (updating || removing) {
      return;
    }

    await removeFromCart(book._id);
  };

  return (
    <article className="flex gap-5 border-b border-border py-6 last:border-b-0">
      <Link
        to={`/books/${book._id}`}
        className="w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-soft sm:w-28"
      >
        <div className="flex aspect-[3/4] items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center font-serif text-sm font-semibold text-primary">
              {book.title}
            </span>
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          {book.author}
        </p>

        <Link to={`/books/${book._id}`}>
          <h2 className="mt-1 font-serif text-xl font-bold text-primary transition-colors hover:text-primary-hover">
            {book.title}
          </h2>
        </Link>

        <p className="mt-3 text-base font-semibold text-text">
          ₹{Number(book.price).toFixed(2)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-text-secondary">
            Quantity
          </span>

          <div className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-surface">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || updating || removing}
              className="px-3 py-2 text-lg text-text transition-colors hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Decrease quantity of ${book.title}`}
            >
              −
            </button>

            <span
              className="min-w-10 border-x border-border px-3 py-2 text-center text-sm font-semibold text-text"
              aria-live="polite"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={
                item.quantity >= book.stock || updating || removing
              }
              className="px-3 py-2 text-lg text-text transition-colors hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Increase quantity of ${book.title}`}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={updating || removing}
            className="text-sm font-medium text-text-secondary transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>

        {item.quantity >= book.stock && (
          <p className="mt-2 text-xs text-text-secondary">
            Maximum available quantity reached.
          </p>
        )}
      </div>
    </article>
  );
};

export default CartItem;