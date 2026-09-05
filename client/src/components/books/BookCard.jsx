import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow duration-200 hover:shadow-md">
      <Link
        to={`/books/${book._id}`}
        className="block bg-soft"
      >
        <div className="flex aspect-[3/4] items-center justify-center overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center">
              <span className="font-serif text-xl font-semibold text-primary">
                {book.title}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          {book.author}
        </p>

        <Link to={`/books/${book._id}`}>
          <h2 className="mt-2 line-clamp-2 font-serif text-xl font-bold text-primary transition-colors hover:text-primary-hover">
            {book.title}
          </h2>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-text">
            ₹{Number(book.price).toFixed(2)}
          </p>

          {book.stock > 0 ? (
            <span className="text-xs font-medium text-primary">
              In stock
            </span>
          ) : (
            <span className="text-xs font-medium text-red-600">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookCard;