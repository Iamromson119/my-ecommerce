import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateQty, removeFromCart, subtotal, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-10 text-ink/50">Loading&hellip;</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-8">Your cart</h1>

      {cart.length === 0 ? (
        <div className="text-ink/60">
          Your cart is empty.{" "}
          <Link to="/" className="text-moss underline">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border border-sand rounded-lg p-4 bg-white"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md bg-sand"
                />
                <div className="flex-1">
                  <Link to={`/products/${item.product._id}`} className="font-medium hover:text-moss">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-ink/50">${item.product.price.toFixed(2)} each</p>
                </div>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item.product._id, Number(e.target.value))}
                  className="border border-sand rounded-md px-2 py-1 bg-white"
                >
                  {[...Array(10).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
                <p className="w-20 text-right font-medium">
                  ${(item.product.price * item.qty).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-clay text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center border-t border-sand pt-6">
            <p className="text-lg">
              Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span>
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-moss text-paper px-6 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors"
            >
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
