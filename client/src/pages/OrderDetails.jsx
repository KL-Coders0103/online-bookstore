import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getOrderById } from "../services/orderService";
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
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
          setError(err.message || "Unable to load this order.");
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
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          role="alert"
          className="rounded-xl border border-border bg-surface p-8 text-center"
        >
          <h1 className="font-serif text-2xl font-bold text-primary">
            Order not found
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {error || "We couldn't find the order you're looking for."}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const statusInfo = getStatusInfo(order.status);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <button
        type="button"
        onClick={() => navigate("/orders")}
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
      >
        <span aria-hidden="true">←</span>
        Back to My Orders
      </button>

      {/* Order Header */}
      <header className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Order details
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold text-primary sm:text-4xl">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>

            <p className="mt-2 break-all font-mono text-xs text-text-secondary">
              {order._id}
            </p>

            <p className="mt-3 text-sm text-text-secondary">
              Placed on{" "}
              <span className="font-medium text-text">
                {orderDate}
              </span>
            </p>
          </div>

          <span className={`w-fit rounded-full bg-soft px-3 py-1.5 text-xs font-semibold ${statusInfo.classes}`}>
            {statusInfo.label}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Items */}
        <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary">
            Items
          </h2>

          <div className="mt-6 divide-y divide-border">
            {order.items.map((item) => (
              <div
                key={`${item.book}-${item.title}`}
                className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-text">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-text-secondary">
                    ₹{Number(item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-primary">
                  ₹
                  {(Number(item.price) * Number(item.quantity)).toFixed(
                    2
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
            <span className="font-semibold text-text">Total</span>

            <span className="text-xl font-bold text-primary">
              ₹{Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </section>

        {/* Shipping */}
        <section className="h-fit rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary">
            Shipping Address
          </h2>

          <div className="mt-5 space-y-1 text-sm leading-6 text-text-secondary">
            <p className="font-semibold text-text">
              {order.shippingAddress.fullName}
            </p>

            <p>{order.shippingAddress.addressLine1}</p>

            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}

            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}
            </p>

            <p>{order.shippingAddress.postalCode}</p>

            <p>{order.shippingAddress.country}</p>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/orders"
          className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary"
        >
          View All Orders
        </Link>

        <Link
          to="/books"
          className="rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
};

export default OrderDetails;