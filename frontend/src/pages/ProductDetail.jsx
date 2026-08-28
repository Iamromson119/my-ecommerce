import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
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
      setMessage("Added to cart.");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add to cart.");
    }
  };

  if (error) return <p className="max-w-6xl mx-auto px-6 py-10 text-clay">{error}</p>;
  if (!product) return <p className="max-w-6xl mx-auto px-6 py-10 text-ink/50">Loading&hellip;</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square rounded-lg overflow-hidden bg-sand">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
        <h1 className="font-display text-3xl mt-1">{product.name}</h1>
        <p className="mt-4 text-2xl font-medium text-clay">${product.price.toFixed(2)}</p>
        <p className="mt-4 text-ink/70 leading-relaxed">{product.description}</p>
        <p className="mt-2 text-sm text-ink/50">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="border border-sand rounded-md px-3 py-2 bg-white"
          >
            {[...Array(Math.min(product.stock, 10)).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                {n + 1}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-moss text-paper px-6 py-2 rounded-md font-medium hover:bg-moss/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to cart
          </button>
        </div>
        {message && <p className="mt-3 text-moss text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default ProductDetail;
