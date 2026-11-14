import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingCart, Check, Truck, PackageCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Product not found.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, qty);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  if (error) return <p className="max-w-6xl mx-auto px-6 py-10 text-clay">{error}</p>;

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square rounded-xl bg-sand" />
        <div className="space-y-4">
          <div className="h-3 w-20 bg-sand rounded" />
          <div className="h-8 w-2/3 bg-sand rounded" />
          <div className="h-6 w-24 bg-sand rounded" />
          <div className="h-20 w-full bg-sand rounded" />
        </div>
      </div>
    );
  }

  const maxQty = Math.min(product.stock, 10);
  const soldOut = product.stock === 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <nav className="flex items-center gap-1 text-sm text-ink/60 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-moss">Shop</Link>
        <ChevronRight size={14} />
        <span>{product.category}</span>
        <ChevronRight size={14} />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-xl overflow-hidden bg-sand border border-sand">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/60">{product.category}</p>
          <h1 className="font-display text-3xl mt-1">{product.name}</h1>
          <p className="mt-4 text-2xl font-medium text-clay">{formatPrice(product.price)}</p>
          <p className="mt-4 text-ink/70 leading-relaxed">{product.description}</p>

          <p
            className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
              soldOut ? "text-clay" : "text-moss"
            }`}
          >
            {!soldOut && <Check size={16} />}
            {soldOut
              ? "Out of stock"
              : product.stock <= 5
              ? `Only ${product.stock} left`
              : `${product.stock} in stock`}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-sand rounded-md bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="p-3 hover:text-moss disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty}
                aria-label="Increase quantity"
                className="p-3 hover:text-moss disabled:opacity-30"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={soldOut}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-moss text-paper px-6 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} /> Add to cart
            </button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-sand pt-6 text-sm text-ink/70">
            <li className="flex items-center gap-3">
              <Truck size={18} className="text-moss" /> Free shipping on orders over ₹100
            </li>
            <li className="flex items-center gap-3">
              <PackageCheck size={18} className="text-moss" /> Track the status of your order
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
