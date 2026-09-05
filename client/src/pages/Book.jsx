import { useEffect, useState } from "react";
import BookCard from "../components/books/BookCard";
import BookFilters from "../components/books/BookFilters";
import { getBooks, getCategories } from "../services/bookService";

const DEFAULT_LIMIT = 8;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalBooks: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        if (!cancelled) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load categories. Please try again.",
          );
        }
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBooks({
          search,
          category,
          sort,
          page,
          limit: DEFAULT_LIMIT,
        });

        if (!cancelled) {
          setBooks(data.books || []);

          setPagination(
            data.pagination || {
              page,
              limit: DEFAULT_LIMIT,
              totalBooks: 0,
              totalPages: 0,
            },
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load books. Please try again.",
          );
          setBooks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [search, category, sort, page]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((currentPage) =>
      Math.min(currentPage + 1, pagination.totalPages),
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Explore our collection
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-primary sm:text-5xl">
            Books
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
            Discover stories, ideas, and perspectives worth spending
            time with.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <BookFilters
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onClear={handleClear}
        />

        <div className="mt-8">
          {loading && (
            <div className="py-16 text-center">
              <p className="text-text-secondary">
                Loading books...
              </p>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
              <h2 className="font-serif text-2xl font-bold text-primary">
                No books found
              </h2>

              <p className="mt-2 text-text-secondary">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={handleClear}
                className="mt-6 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-text">
                    {books.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text">
                    {pagination.totalBooks}
                  </span>{" "}
                  books
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-text-secondary">
                    Page{" "}
                    <span className="font-semibold text-text">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-text">
                      {pagination.totalPages}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page === pagination.totalPages}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Books;