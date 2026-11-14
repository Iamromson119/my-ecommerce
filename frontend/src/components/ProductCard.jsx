import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = async (e) => {
    // the whole card is a link, so stop it from opening the product page
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block rounded-xl overflow-hidden border border-sand bg-white shadow-sm hover:shadow-md hover:border-moss/40 transition-all"
    >
      <div className="relative aspect-square overflow-hidden bg-sand">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {soldOut && (
          <span className="absolute top-3 left-3 bg-ink text-paper text-xs font-medium px-2.5 py-1 rounded-full">
            Sold out
          </span>
        )}
        {lowStock && (
          <span className="absolute top-3 left-3 bg-clay text-paper text-xs font-medium px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}

        {!soldOut && (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 bg-moss text-paper p-2.5 rounded-full shadow-md hover:bg-moss/90 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus:opacity-100 transition-all"
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-ink/60">{product.category}</p>
        <h3 className="font-display text-lg mt-1">{product.name}</h3>
        <p className="mt-2 font-medium text-clay">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
