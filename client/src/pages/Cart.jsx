import { Link } from "react-router-dom";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import useCart from "../hooks/useCart";

const Cart = () => {
  const {
    cart,
    loading,
    error,
    clearCart,
    clearing,
  } = useCart();

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading your cart...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-primary">
            Unable to load your cart
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  const handleClearCart = async () => {
    if (clearing) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (!confirmed) {
      return;
    }

    await clearCart();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Your shopping bag
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-primary sm:text-5xl">
            Your Cart
          </h1>

          <p className="mt-3 text-text-secondary">
            Review the books you've selected before checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearing}
            className="w-fit rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {clearing ? "Clearing..." : "Clear Cart"}
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="rounded-xl border border-border bg-surface px-5 sm:px-8">
            {items.map((item) => (
              <CartItem
                key={item.book?._id || item.book}
                item={item}
              />
            ))}
          </div>

          <CartSummary items={items} />
        </section>
      ) : (
        <section className="mt-10 rounded-xl border border-border bg-surface">
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-soft">
              <span
                className="font-serif text-2xl font-bold text-primary"
                aria-hidden="true"
              >
                B
              </span>
            </div>

            <h2 className="mt-6 font-serif text-3xl font-bold text-primary">
              Your cart is empty
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
              Looks like you haven't added any books yet. Explore our
              collection and find your next great read.
            </p>

            <Link
              to="/books"
              className="mt-7 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Browse Books
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default Cart;