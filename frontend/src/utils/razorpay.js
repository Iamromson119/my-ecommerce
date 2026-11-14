import toast from "react-hot-toast";
import api from "../api/axios";

const loadCheckoutScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Opens the Razorpay popup for an order that is already saved on our server.
// Resolves with the updated (paid) order, or with null if the person closed the popup.
export const payForOrder = async (orderId, user) => {
  const loaded = await loadCheckoutScript();
  if (!loaded) throw new Error("Could not load Razorpay. Check your connection and try again.");

  // the server works out the amount from the saved order, the browser never sends it
  const { data } = await api.post("/payments/razorpay/order", { orderId });

  return new Promise((resolve, reject) => {
    let finished = false;

    const checkout = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: "Meridian",
      description: `Order #${orderId.slice(-8)}`,
      prefill: { name: user?.name, email: user?.email },
      theme: { color: "#3F6B4F" },
      handler: async (response) => {
        try {
          const { data: paidOrder } = await api.post("/payments/razorpay/verify", {
            orderId,
            ...response,
          });
          finished = true;
          resolve(paidOrder);
        } catch (err) {
          finished = true;
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          if (!finished) resolve(null);
        },
      },
    });

    // a failed attempt can be retried inside the popup, so just tell the person
    checkout.on("payment.failed", (response) => {
      toast.error(response.error?.description || "Payment failed. You can try again.");
    });

    checkout.open();
  });
};
