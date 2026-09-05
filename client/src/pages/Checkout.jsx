import { Link } from "react-router-dom";

import CartSummary from "../components/cart/CartSummary";
import useCart from "../hooks/useCart";

const Checkout = () => {
  const { cart, loading, error } = useCart();

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading checkout...
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
            Unable to load checkout
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {error}
          </p>

          <Link
            to="/cart"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Back to Cart
          </Link>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            Add some books before continuing to checkout.
          </p>

          <Link
            to="/books"
            className="mt-7 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Browse Books
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Complete your order
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold text-primary sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-3 text-text-secondary">
          Review your order before placing it.
        </p>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary">
            Order Review
          </h2>

          <div className="mt-6 divide-y divide-border">
            {items.map((item) => {
              const book = item.book;

              if (!book) {
                return null;
              }

              const price = Number(book.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const lineTotal = price * quantity;

              return (
                <div
                  key={book._id}
                  className="flex gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-soft">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`Cover of ${book.title}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-1 text-center font-serif text-xs font-semibold text-primary">
                        {book.title}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-bold text-primary">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                      {book.author}
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                      ₹{price.toFixed(2)} × {quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-text">
                    ₹{lineTotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <CartSummary items={items} />
      </section>
    </main>
  );
};

export default Checkout;