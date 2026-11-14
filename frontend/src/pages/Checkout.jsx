import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, CreditCard, Info } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { payForOrder } from "../utils/razorpay";
import { formatPrice } from "../utils/format";

const paymentOptions = [
  {
    value: "Cash on Delivery",
    icon: Banknote,
    title: "Cash on delivery",
    text: "Pay when the order arrives",
  },
  {
    value: "Razorpay",
    icon: CreditCard,
    title: "Pay online",
    text: "Cards, UPI and netbanking through Razorpay",
  },
];

const inputClass =
  "w-full border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss";

const Checkout = () => {
  const { user } = useAuth();
  const { cart, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", { shippingAddress: form, paymentMethod });
      await refreshCart();

      // the order is saved at this point, so whatever happens in the popup
      // the person ends up on the order page and can pay or cancel from there
      if (paymentMethod === "Razorpay") {
        try {
          const paid = await payForOrder(data._id, user);
          if (paid) toast.success("Payment received. Thank you!");
          else toast("Order saved. You can finish paying from this page.");
        } catch (err) {
          toast.error(err.response?.data?.message || err.message || "Payment could not be completed");
        }
      }

      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <p className="max-w-4xl mx-auto px-6 py-10 text-ink/60">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-3xl mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              name="postalCode"
              placeholder="Postal code"
              value={form.postalCode}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <fieldset className="pt-2">
            <legend className="font-display text-xl mb-3">Payment</legend>
            <div className="space-y-3">
              {paymentOptions.map(({ value, icon: Icon, title, text }) => {
                const selected = paymentMethod === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-moss ${
                      selected ? "border-moss bg-moss/5" : "border-sand bg-white hover:border-moss/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={selected}
                      onChange={() => setPaymentMethod(value)}
                      className="sr-only"
                    />
                    <span className={`rounded-lg p-2 ${selected ? "bg-moss text-paper" : "bg-sand/70 text-moss"}`}>
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block font-medium">{title}</span>
                      <span className="block text-sm text-ink/60">{text}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {paymentMethod === "Razorpay" && (
              <p className="mt-3 flex items-start gap-2 rounded-md bg-sand/50 p-3 text-sm text-ink/70">
                <Info size={16} className="mt-0.5 shrink-0" />
                <span>
                  This runs in Razorpay test mode, so no real money is charged. In the popup choose
                  UPI and enter <strong>success@razorpay</strong>.
                </span>
              </p>
            )}
          </fieldset>

          {error && <p className="text-clay text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-moss text-paper px-6 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Placing order..."
              : paymentMethod === "Razorpay"
              ? `Place order and pay ${formatPrice(total)}`
              : "Place order"}
          </button>
        </form>
      </div>

      <div className="border border-sand rounded-lg p-6 bg-white h-fit">
        <h2 className="font-display text-xl mb-4">Order summary</h2>
        <div className="space-y-2 text-sm">
          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between">
              <span>
                {item.product.name} &times; {item.qty}
              </span>
              <span>{formatPrice(item.product.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-sand mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-medium text-base pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
