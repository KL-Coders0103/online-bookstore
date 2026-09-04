import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Unauthorized = () => {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-background px-5 py-16">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Access restricted
        </p>

        <p className="mt-4 font-serif text-7xl font-bold text-primary">
          403
        </p>

        <h1 className="mt-4 font-serif text-3xl font-bold text-text">
          You don't have permission to view this page.
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-text-secondary">
          The page you're trying to access is restricted to authorized users.
        </p>

        <div className="mt-8">
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Unauthorized;