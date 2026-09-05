import api from "./api";

const getBooks = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();

  return api(`/books${queryString ? `?${queryString}` : ""}`);
};

const getBookById = async (id) => {
  const data = await api(`/books/${id}`);
  return data.book;
};

const getCategories = async () => {
  return api("/categories");
};

export { getBooks, getBookById, getCategories};