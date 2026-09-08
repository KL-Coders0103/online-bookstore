import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Book from "./pages/Book";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/unauthorized";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/books"
            element={<Book />}
          />

          <Route
            path="/books/:id"
            element={<BookDetails />}
          />

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path ="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;