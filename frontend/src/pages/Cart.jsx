import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

// same rule the server uses when the order is placed
const FREE_SHIPPING_FROM = 100;
const SHIPPING_FEE = 10;

const Cart = () => {
  const { cart, updateQty, removeFromCart, subtotal, loading } = useCart();
  const navigate = useNavigate();

  const changeQty = async (productId, qty) => {
    try {
      await updateQty(productId, qty);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update the cart");
    }
  };

  const remove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      toast.error("Could not remove that item");
    }
  };

  if (loading) {
    return <p className="max-w-5xl mx-auto px-6 py-10 text-ink/60">Loading&hellip;</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-ink/60">
        <ShoppingBag size={44} className="mx-auto mb-4" />
        <h1 className="font-display text-2xl text-ink mb-2">Your cart is empty</h1>
        <p className="mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-moss text-paper px-5 py-3 rounded-md font-medium hover:bg-moss/90"
        >
          Browse products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const shipping = subtotal > FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-8">Your cart</h1>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const max = item.product.stock ?? 10;
            return (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border border-sand rounded-xl p-4 bg-white"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-sand"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="font-medium hover:text-moss block truncate"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-ink/60">{formatPrice(item.product.price)} each</p>

                  <div className="mt-2 inline-flex items-center border border-sand rounded-md">
                    <button
                      onClick={() => changeQty(item.product._id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label="Decrease quantity"
                      className="p-1.5 hover:text-moss disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.product._id, item.qty + 1)}
                      disabled={item.qty >= max}
                      aria-label="Increase quantity"
                      className="p-1.5 hover:text-moss disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <p className="font-medium w-20 text-right">
                  {formatPrice(item.product.price * item.qty)}
                </p>
                <button
                  onClick={() => remove(item.product._id)}
                  aria-label={`Remove ${item.product.name}`}
                  className="p-2 text-ink/60 hover:text-clay"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* order summary */}
        <aside className="border border-sand rounded-xl bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl mb-4">Order summary</h2>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/70">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-sand pt-3 mt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {shipping > 0 && (
            <p className="mt-4 flex items-start gap-2 text-sm text-moss">
              <Truck size={16} className="mt-0.5 shrink-0" />
              Add {formatPrice(Math.max(remaining, 0.01))} more for free shipping.
            </p>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-moss text-paper px-6 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors"
          >
            Proceed to checkout <ArrowRight size={18} />
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
