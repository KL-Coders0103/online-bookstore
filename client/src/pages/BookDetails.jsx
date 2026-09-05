import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { getBookById } from "../services/bookService";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { addToCart, adding } = useCart();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBook = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBookById(id);

        if (!cancelled) {
          setBook(data);
          setQuantity(1);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load book details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleQuantityDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleQuantityIncrease = () => {
    if (!book) {
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(book.stock, currentQuantity + 1)
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/books/${id}`,
        },
      });

      return;
    }

    if (!book || book.stock <= 0) {
      return;
    }

    setCartMessage("");
    setCartError("");

    const result = await addToCart(book._id, quantity);

    if (result.success) {
      setCartMessage(
        quantity === 1
          ? "Book added to your cart."
          : `${quantity} copies added to your cart.`
      );
    } else {
      setCartError(result.error);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading book details...
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
            Unable to load this book
          </h1>

          <p className="mt-3 text-sm text-text-secondary">{error}</p>

          <Link
            to="/books"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Back to Books
          </Link>
        </div>
      </main>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/books"
        className="inline-flex items-center text-sm font-medium text-text-secondary transition-colors hover:text-primary"
      >
        ← Back to Books
      </Link>

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-border bg-soft">
          <div className="flex aspect-[3/4] items-center justify-center">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="px-8 text-center">
                <p className="font-serif text-3xl font-bold text-primary">
                  {book.title}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          {book.category?.name && (
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {book.category.name}
            </p>
          )}

          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-primary sm:text-5xl">
            {book.title}
          </h1>

          <p className="mt-3 text-lg text-text-secondary">
            by {book.author}
          </p>

          <div className="mt-8 border-y border-border py-6">
            <p className="text-3xl font-semibold text-text">
              ₹{Number(book.price).toFixed(2)}
            </p>

            <div className="mt-4">
              {book.stock > 0 ? (
                <p className="text-sm font-medium text-primary">
                  In stock · {book.stock} available
                </p>
              ) : (
                <p className="text-sm font-medium text-red-600">
                  Out of stock
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-2xl font-bold text-primary">
              About this book
            </h2>

            <p className="mt-4 max-w-3xl whitespace-pre-line leading-7 text-text-secondary">
              {book.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                ISBN
              </p>

              <p className="mt-1 text-sm text-text">{book.isbn}</p>
            </div>

            {book.publishedDate && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Published
                </p>

                <p className="mt-1 text-sm text-text">
                  {new Date(book.publishedDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Cart controls */}
          <div className="mt-8">
            {book.stock > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className="inline-flex w-fit items-center overflow-hidden rounded-lg border border-border bg-surface"
                  aria-label="Quantity selector"
                >
                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1 || adding}
                    className="px-4 py-3 text-lg text-text transition-colors hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span
                    className="min-w-12 border-x border-border px-4 py-3 text-center text-sm font-semibold text-text"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= book.stock || adding}
                    className="px-4 py-3 text-lg text-text transition-colors hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            )}

            {!user && book.stock > 0 && (
              <p className="mt-3 text-sm text-text-secondary">
                You’ll need to log in before adding items to your cart.
              </p>
            )}

            {cartMessage && (
              <p
                className="mt-4 text-sm font-medium text-primary"
                role="status"
              >
                {cartMessage}
              </p>
            )}

            {cartError && (
              <p
                className="mt-4 text-sm font-medium text-red-600"
                role="alert"
              >
                {cartError}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookDetails;