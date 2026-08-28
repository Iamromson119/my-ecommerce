import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

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

  if (error) return <p className="max-w-4xl mx-auto px-6 py-10 text-clay">{error}</p>;
  if (!order) return <p className="max-w-4xl mx-auto px-6 py-10 text-ink/50">Loading&hellip;</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-2">Order #{order._id.slice(-8)}</h1>
      <p className="text-ink/50 mb-8 capitalize">Status: {order.status}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl mb-3">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product} className="flex items-center gap-4 border border-sand rounded-lg p-3 bg-white">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-sand" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-ink/50">
                    {item.qty} &times; ${item.price.toFixed(2)}
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
            <p className="pt-2 text-ink/50">Payment: {order.paymentMethod}</p>
          </div>

          <h2 className="font-display text-xl mt-6 mb-3">Total</h2>
          <div className="border border-sand rounded-lg p-4 bg-white text-sm space-y-1">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-sand mt-2">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
