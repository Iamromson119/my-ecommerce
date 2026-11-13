import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  Package,
  LayoutDashboard,
  ShoppingCart,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "bg-sand/60 text-moss" : "hover:bg-sand/40 hover:text-moss"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const cartLink = (
    <NavLink to="/cart" className={linkClass} onClick={() => setOpen(false)} aria-label="Cart">
      <span className="relative">
        <ShoppingCart size={18} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-clay text-paper text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </span>
      <span className="hidden md:inline">Cart</span>
    </NavLink>
  );

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
        <Store size={18} /> Shop
      </NavLink>
      {user && (
        <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>
          <Package size={18} /> Orders
        </NavLink>
      )}
      {user?.role === "admin" && (
        <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
          <LayoutDashboard size={18} /> Admin
        </NavLink>
      )}
      {user ? (
        <button onClick={handleLogout} className={linkClass({ isActive: false })}>
          <LogOut size={18} /> Log out
        </button>
      ) : (
        <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
          <LogIn size={18} /> Log in
        </NavLink>
      )}
    </>
  );

  return (
    <header className="border-b border-sand bg-paper/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <span className="bg-moss text-paper rounded-lg p-1.5">
            <ShoppingBag size={20} />
          </span>
          Meridian
        </Link>

        {/* desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links}
          {cartLink}
        </nav>

        {/* mobile: cart stays in the bar, the rest goes in the menu */}
        <div className="flex items-center gap-1 md:hidden">
          {cartLink}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-sand/40"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-sand px-4 py-3 flex flex-col gap-1">{links}</nav>
      )}
    </header>
  );
};

export default Navbar;
