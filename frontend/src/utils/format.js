// Razorpay charges in rupees, so the whole shop shows prices in INR
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

export const formatPrice = (amount) => rupees.format(amount);
