import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-sand bg-paper sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight text-ink">
          Meridian
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-moss transition-colors">
            Shop
          </Link>
          {user && (
            <Link to="/orders" className="hover:text-moss transition-colors">
              Orders
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-moss transition-colors">
              Admin
            </Link>
          )}
          <Link to="/cart" className="relative hover:text-moss transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-clay text-paper text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={handleLogout} className="hover:text-clay transition-colors">
              Log out
            </button>
          ) : (
            <Link to="/login" className="hover:text-moss transition-colors">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
