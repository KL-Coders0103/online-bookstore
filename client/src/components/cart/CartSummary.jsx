import { Link } from "react-router-dom";

const CartSummary = ({ items, showCheckoutLink = true }) => {
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.book?.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);

  const itemCount = items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <aside className="h-fit rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
      <h2 className="font-serif text-2xl font-bold text-primary">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-text-secondary">
            Items ({itemCount})
          </span>

          <span className="font-medium text-text">
            {itemCount}
          </span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-semibold text-text">
              Subtotal
            </span>

            <span className="text-xl font-bold text-primary">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {showCheckoutLink && (
        <Link
          to="/checkout"
          className="mt-6 block w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Proceed to Checkout
        </Link>
      )}
    </aside>
  );
};

export default CartSummary;