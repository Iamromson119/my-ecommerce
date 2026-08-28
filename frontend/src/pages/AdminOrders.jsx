import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await api.get("/admin/orders");
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/admin/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Manage orders</h1>
        <Link to="/admin" className="text-moss underline text-sm">
          Back to dashboard
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-ink/50 border-b border-sand">
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-sand">
                <td className="py-3 pr-4">#{order._id.slice(-8)}</td>
                <td className="py-3 pr-4">{order.user?.name || "Unknown"}</td>
                <td className="py-3 pr-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-4">${order.totalPrice.toFixed(2)}</td>
                <td className="py-3 pr-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-sand rounded-md px-2 py-1 bg-white capitalize"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-ink/50 mt-4">No orders yet.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
