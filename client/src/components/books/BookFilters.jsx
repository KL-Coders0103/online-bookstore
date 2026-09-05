const BookFilters = ({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClear,
}) => {
  const hasFilters = search || category || sort !== "";

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
        {/* Search */}
        <div>
          <label
            htmlFor="book-search"
            className="mb-2 block text-sm font-medium text-text"
          >
            Search books
          </label>

          <input
            id="book-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or author..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="book-category"
            className="mb-2 block text-sm font-medium text-text"
          >
            Category
          </label>

          <select
            id="book-category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item._id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="book-sort"
            className="mb-2 block text-sm font-medium text-text"
          >
            Sort by
          </label>

          <select
            id="book-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A to Z</option>
            <option value="title_desc">Title: Z to A</option>
          </select>
        </div>

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilters}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default BookFilters;