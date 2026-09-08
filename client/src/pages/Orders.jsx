import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrders } from "../services/orderService";

const getStatusInfo = (status) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        classes: "bg-soft text-primary",
      };

    case "shipped":
      return {
        label: "Shipped",
        classes: "bg-blue-50 text-blue-700",
      };

    case "delivered":
      return {
        label: "Delivered",
        classes: "bg-green-50 text-green-700",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        classes: "bg-red-50 text-red-700",
      };

    case "pending":
    default:
      return {
        label: "Pending",
        classes: "bg-soft text-text",
      };
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        if (!cancelled) {
          setOrders(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          role="alert"
          className="rounded-xl border border-border bg-surface p-8 text-center"
        >
          <h1 className="font-serif text-2xl font-bold text-primary">
            Unable to load orders
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {error}
          </p>

          <Link
            to="/books"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Browse Books
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Your purchases
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 text-text-secondary">
              View your previous orders and their current status.
            </p>
          </div>

          {orders.length > 0 && (
            <p className="text-sm font-medium text-text-secondary">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
          )}
        </div>
      </header>

      {orders.length === 0 ? (
        <section className="mt-10 rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft">
            <span className="font-serif text-2xl font-bold text-primary">
              B
            </span>
          </div>

          <h2 className="mt-6 font-serif text-3xl font-bold text-primary">
            No orders yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
            You haven't placed any orders yet. Explore our collection
            and find your next great read.
          </p>

          <Link
            to="/books"
            className="mt-7 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Browse Books
          </Link>
        </section>
      ) : (
        <section className="mt-10 space-y-5">
          {orders.map((order) => {
            const itemCount = order.items.reduce(
              (total, item) => total + item.quantity,
              0
            );

            const orderDate = new Date(
              order.createdAt
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const firstItem = order.items[0];
            const additionalItems = order.items.length - 1;
            const statusInfo = getStatusInfo(order.status);

            return (
              <article
                key={order._id}
                className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-sm sm:p-7"
              >
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Order
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.classes}`}
                        >
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="mt-2 break-all font-mono text-xs text-text-secondary">
                      #{order._id}
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                      Placed on{" "}
                      <span className="font-medium text-text">
                        {orderDate}
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="w-fit shrink-0 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary"
                  >
                    View Order
                  </Link>
                </div>

                {/* Order Content */}
                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Order Items
                      </p>

                      {firstItem && (
                        <div className="mt-2">
                          <p className="font-serif text-lg font-bold text-primary">
                            {firstItem.title}
                          </p>

                          {additionalItems > 0 && (
                            <p className="mt-1 text-sm text-text-secondary">
                              + {additionalItems}{" "}
                              {additionalItems === 1
                                ? "more item"
                                : "more items"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:flex sm:items-center sm:gap-10">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-semibold text-text">
                          {itemCount}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold text-primary">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Action */}
                <div className="mt-6 border-t border-border pt-5 sm:hidden">
                  <Link
                    to={`/orders/${order._id}`}
                    className="block w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    View Order Details
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Orders;