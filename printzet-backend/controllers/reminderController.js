const Order = require("../models/Order");

exports.getReorderRecommendations = async (req, res) => {
  const userId = req.user._id;

  const recentOrders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("items.product");

  // You can adjust the logic here as needed
  const reminders = recentOrders.map((o) => ({
    orderId: o._id,
    items: o.items,
    suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // next week
  }));

  res.json({ reminders });
};
