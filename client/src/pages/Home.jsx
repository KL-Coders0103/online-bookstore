import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Home = () => {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Your next chapter starts here
            </p>

            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              Stories, ideas, and worlds waiting to be discovered.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary">
              Explore a thoughtfully curated collection of books across
              fiction, non-fiction, classics, and more.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/books">
                <Button>Explore Books</Button>
              </Link>

              <Link to="/register">
                <Button variant="secondary">
                  Create an Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Editorial visual */}
          <div className="relative">
            <div className="mx-auto max-w-md">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-soft p-8 shadow-sm">
                <div className="flex h-full flex-col justify-between border border-primary/15 bg-surface p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Featured collection
                    </p>

                    <div className="mt-8 h-px bg-border" />
                  </div>

                  <div>
                    <p className="font-serif text-4xl font-bold leading-tight text-primary">
                      A good book
                      <br />
                      stays with you.
                    </p>

                    <p className="mt-5 text-sm leading-6 text-text-secondary">
                      Discover your next favorite story.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-text-secondary">
                    <span>Est. 2026</span>
                    <span>Read · Discover · Repeat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Browse with purpose
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-4xl">
              Books for every kind of reader.
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
              Whether you're looking for an unforgettable story, a new
              perspective, or something to learn from, there's always another
              book worth opening.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;