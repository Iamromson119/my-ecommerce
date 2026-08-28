import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusColor = {
  pending: "bg-sand text-ink",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-10 text-ink/50">Loading&hellip;</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-8">Your orders</h1>
      {orders.length === 0 ? (
        <p className="text-ink/60">
          No orders yet.{" "}
          <Link to="/" className="text-moss underline">
            Start shopping
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex items-center justify-between border border-sand rounded-lg p-4 bg-white hover:border-moss transition-colors"
            >
              <div>
                <p className="font-medium">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString()} &middot; {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
