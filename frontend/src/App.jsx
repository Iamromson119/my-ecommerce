import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Seo from "./components/Seo.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import NotFound from "./pages/NotFound.jsx";

// pages that shouldn't show up in search results: accounts, cart, admin, 404
const Private = ({ title, children }) => (
  <>
    <Seo title={`${title} | Meridian`} noindex />
    {children}
  </>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<Home />} />
          <Route path="/login" element={<Private title="Log in"><Login /></Private>} />
          <Route path="/register" element={<Private title="Create an account"><Register /></Private>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Private title="Your cart"><Cart /></Private>} />
            <Route path="/checkout" element={<Private title="Checkout"><Checkout /></Private>} />
            <Route path="/orders" element={<Private title="Your orders"><Orders /></Private>} />
            <Route path="/orders/:id" element={<Private title="Order details"><OrderDetail /></Private>} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Private title="Admin dashboard"><AdminDashboard /></Private>} />
            <Route path="/admin/products" element={<Private title="Manage products"><AdminProducts /></Private>} />
            <Route path="/admin/orders" element={<Private title="Manage orders"><AdminOrders /></Private>} />
          </Route>

          <Route path="*" element={<Private title="Page not found"><NotFound /></Private>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
