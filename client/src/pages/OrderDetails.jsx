import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrderById } from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load order details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading order details...
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
            Unable to load order
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {error}
          </p>

          <Link
            to="/books"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-surface px-6 py-10 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft">
          <span
            className="text-2xl font-bold text-primary"
            aria-hidden="true"
          >
            ✓
          </span>
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-accent">
          Order placed successfully
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold text-primary">
          Thank you for your order
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary">
          Your order has been placed successfully. You can find all
          the details below.
        </p>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Order ID
                </p>

                <h2 className="mt-1 break-all font-mono text-sm font-semibold text-text">
                  {order._id}
                </h2>
              </div>

              <span className="w-fit rounded-full bg-soft px-3 py-1.5 text-xs font-semibold capitalize text-primary">
                {order.status}
              </span>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Order Date
              </p>

              <p className="mt-1 text-sm font-medium text-text">
                {orderDate}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Items
            </h2>

            <div className="mt-6 divide-y divide-border">
              {order.items.map((item, index) => {
                const lineTotal = item.price * item.quantity;

                return (
                  <div
                    key={`${item.book}-${index}`}
                    className="flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg font-bold text-primary">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-text-secondary">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-text">
                      ₹{lineTotal.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Shipping Address
            </h2>

            <div className="mt-5 text-sm leading-7 text-text-secondary">
              <p className="font-semibold text-text">
                {order.shippingAddress.fullName}
              </p>

              <p>{order.shippingAddress.addressLine1}</p>

              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>

              <p>{order.shippingAddress.country}</p>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl font-bold text-primary">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-secondary">
                Items
              </span>

              <span className="font-medium text-text">
                {order.items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-text">
                  Total
                </span>

                <span className="text-xl font-bold text-primary">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/books"
            className="mt-6 block w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Continue Shopping
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default OrderDetails;