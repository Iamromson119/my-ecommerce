import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        { label: "Total revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
        { label: "Total orders", value: stats.totalOrders },
        { label: "Total products", value: stats.totalProducts },
        { label: "Total users", value: stats.totalUsers },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Admin dashboard</h1>
        <div className="flex gap-4 text-sm">
          <Link to="/admin/products" className="text-moss underline">
            Manage products
          </Link>
          <Link to="/admin/orders" className="text-moss underline">
            Manage orders
          </Link>
        </div>
      </div>

      {!stats ? (
        <p className="text-ink/50">Loading&hellip;</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="border border-sand rounded-lg p-6 bg-white">
              <p className="text-sm text-ink/50">{c.label}</p>
              <p className="font-display text-3xl mt-2">{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
