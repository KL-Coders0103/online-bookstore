import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { user, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);

      const destination = location.state?.from?.pathname || "/";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
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
              Welcome back
            </p>

            <h1 className="mt-3 max-w-sm font-serif text-4xl font-bold leading-tight">
              Pick up where your reading journey left off.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-white/70">
              Sign in to manage your books, cart, orders, and personal
              account.
            </p>
          </div>

          <p className="text-sm text-white/50">
            Stories worth reading.
          </p>
        </section>

        {/* Form */}
        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="lg:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Welcome back
              </p>
            </div>

            <h2 className="mt-2 font-serif text-3xl font-bold text-primary">
              Sign in
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Enter your details to continue to your account.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <Input
                id="login-email"
                name="email"
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <Input
                id="login-password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-text-secondary">
                New here?
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;