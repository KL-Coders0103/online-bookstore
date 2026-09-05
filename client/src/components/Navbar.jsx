import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg text-white">
            B
          </div>

          <div className="hidden sm:block">
            <p className="font-serif text-lg font-bold leading-none text-primary">
              Online Bookstore
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              Stories worth reading
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-soft hover:text-primary"
          >
            Home
          </Link>

          <Link
            to="/books"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-soft hover:text-primary"
          >
            Books
          </Link>

          {user ? (
            <>
              <Link
                to="/cart"
                className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-soft hover:text-primary"
              >
                <span className="inline-flex items-center gap-1.5">
                  Cart

                  {cartItemCount > 0 && (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                      {cartItemCount}
                    </span>
                  )}
                </span>
              </Link>

              <Link
                to="/profile"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-soft hover:text-primary sm:block"
              >
                Profile
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-soft hover:text-primary sm:block"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-soft hover:text-primary sm:block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="ml-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;