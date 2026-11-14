import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreditCard, CircleCheck, Clock, CircleX } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { payForOrder } from "../utils/razorpay";
import { formatPrice } from "../utils/format";

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Order not found.");
      }
    };
    fetchOrder();
  }, [id]);

  const handlePay = async () => {
    setBusy(true);
    try {
      const paid = await payForOrder(order._id, user);
      if (paid) {
        setOrder({ ...order, ...paid });
        toast.success("Payment received. Thank you!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Payment could not be completed");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setBusy(true);
    try {
      const { data } = await api.put(`/orders/${order._id}/cancel`);
      setOrder({ ...order, ...data });
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel the order");
    } finally {
      setBusy(false);
    }
  };

  if (error) return <p className="max-w-4xl mx-auto px-6 py-10 text-clay">{error}</p>;
  if (!order) return <p className="max-w-4xl mx-auto px-6 py-10 text-ink/60">Loading&hellip;</p>;

  const online = order.paymentMethod === "Razorpay";
  const canPay = online && !order.isPaid && order.status === "pending";
  const canCancel = !order.isPaid && order.status === "pending";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-2">Order #{order._id.slice(-8)}</h1>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm">
        <span className="text-ink/60 capitalize">Status: {order.status}</span>
        {order.isPaid ? (
          <span className="inline-flex items-center gap-1.5 text-moss font-medium">
            <CircleCheck size={16} /> Paid on {new Date(order.paidAt).toLocaleDateString()}
          </span>
        ) : order.status === "cancelled" ? (
          <span className="inline-flex items-center gap-1.5 text-clay font-medium">
            <CircleX size={16} /> Cancelled
          </span>
        ) : online ? (
          <span className="inline-flex items-center gap-1.5 text-clay font-medium">
            <Clock size={16} /> Waiting for payment
          </span>
        ) : null}
      </div>

      {(canPay || canCancel) && (
        <div className="flex flex-wrap gap-3 mb-8">
          {canPay && (
            <button
              onClick={handlePay}
              disabled={busy}
              className="inline-flex items-center gap-2 bg-moss text-paper px-5 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors disabled:opacity-50"
            >
              <CreditCard size={18} /> Pay {formatPrice(order.totalPrice)} now
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={busy}
              className="px-5 py-3 rounded-md font-medium border border-clay text-clay hover:bg-clay/5 transition-colors disabled:opacity-50"
            >
              Cancel order
            </button>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl mb-3">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product} className="flex items-center gap-4 border border-sand rounded-lg p-3 bg-white">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-sand" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-ink/60">
                    {item.qty} &times; {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl mb-3">Shipping</h2>
          <div className="border border-sand rounded-lg p-4 bg-white text-sm space-y-1">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2 text-ink/60">Payment: {order.paymentMethod}</p>
          </div>

          <h2 className="font-display text-xl mt-6 mb-3">Total</h2>
          <div className="border border-sand rounded-lg p-4 bg-white text-sm space-y-1">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-sand mt-2">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
