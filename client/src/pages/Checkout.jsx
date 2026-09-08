import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CartSummary from "../components/cart/CartSummary";
import useCart from "../hooks/useCart";
import { createOrder } from "../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    error,
    fetchCart,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));

    if (orderError) {
      setOrderError("");
    }
  };

  const validateShippingAddress = () => {
    const requiredFields = [
      ["fullName", "Full name"],
      ["addressLine1", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
    ];

    for (const [field, label] of requiredFields) {
      if (!shippingAddress[field].trim()) {
        return `${label} is required.`;
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (placingOrder) {
      return;
    }

    setOrderError("");

    const validationError = validateShippingAddress();

    if (validationError) {
      setOrderError(validationError);
      return;
    }

    const orderItems = items
      .filter((item) => item.book?._id)
      .map((item) => ({
        bookId: item.book._id,
        quantity: item.quantity,
      }));

    if (orderItems.length === 0) {
      setOrderError(
        "Your cart does not contain any valid books. Please return to your cart."
      );
      return;
    }

    setPlacingOrder(true);

    try {
      const order = await createOrder({
        items: orderItems,
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          addressLine1: shippingAddress.addressLine1.trim(),
          addressLine2: shippingAddress.addressLine2.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country.trim(),
        },
      });

      await fetchCart();

      navigate(`/orders/${order._id}`, {
        state: {
          orderCreated: true,
        },
      });
    } catch (err) {
      setOrderError(
        err.message ||
          "Unable to place your order. Your cart has not been changed."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

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
          Enter your shipping details and review your order.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
      >
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Shipping Address
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-text"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine1"
                  className="text-sm font-semibold text-text"
                >
                  Address Line 1
                </label>

                <input
                  id="addressLine1"
                  name="addressLine1"
                  type="text"
                  value={shippingAddress.addressLine1}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  placeholder="House no., street, area"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine2"
                  className="text-sm font-semibold text-text"
                >
                  Address Line 2
                  <span className="ml-1 font-normal text-text-secondary">
                    (Optional)
                  </span>
                </label>

                <input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  value={shippingAddress.addressLine2}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  placeholder="Apartment, landmark, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="text-sm font-semibold text-text"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  placeholder="City"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="text-sm font-semibold text-text"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  placeholder="State"
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="text-sm font-semibold text-text"
                >
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  placeholder="Postal code"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="text-sm font-semibold text-text"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </section>

          {orderError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {orderError}
            </div>
          )}

          <Link
            to="/cart"
            className="inline-block text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            ← Back to Cart
          </Link>
        </div>

        <div>
          <CartSummary items={items} showCheckoutLink={false} />

          <button
            type="submit"
            disabled={placingOrder}
            className="mt-4 w-full rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Checkout;