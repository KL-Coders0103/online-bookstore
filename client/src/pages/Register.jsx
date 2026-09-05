import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";
import validateRegisterForm from "../validators/authValidator";

const Register = () => {
  const { user, register } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    const validationErrors = validateRegisterForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password,
      );

      navigate("/", { replace: true });
    } catch (err) {
      setServerError(
        err.message || "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-background px-5 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:grid-cols-2">
        {/* Brand panel */}
        <section className="hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-lg font-bold text-primary">
              B
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Join the bookstore
            </p>

            <h1 className="mt-3 max-w-sm font-serif text-4xl font-bold leading-tight">
              Make room for another great story.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-white/70">
              Create your account and keep your books, cart, and orders
              together in one place.
            </p>
          </div>

          <p className="text-sm text-white/50">
            Stories worth reading.
          </p>
        </section>

        {/* Form */}
        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Create your account
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-primary">
              Get started
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              It only takes a moment to create your bookstore account.
            </p>

            {serverError && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <Input
                id="register-name"
                name="name"
                label="Full name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                error={errors.name}
                required
              />

              <Input
                id="register-email"
                name="email"
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email}
                required
              />

              <Input
                id="register-password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                error={errors.password}
                required
              />

              <Input
                id="register-confirm-password"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your password again"
                autoComplete="new-password"
                error={errors.confirmPassword}
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;