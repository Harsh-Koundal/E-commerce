import Order from "../models/Order.js";

export const getReorderRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch last 5 successful/completed print orders
    const recentOrders = await Order.find({
      user: userId,
      status: { $in: ["completed", "delivered"] },
      type: "print", // Optional, if you categorize order types
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("productName image createdAt");

    const recommendations = recentOrders.map((order) => ({
      orderId: order._id,
      productName: order.productName,
      image: order.image,
      lastOrderedAt: order.createdAt,
    }));

    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching reorder recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
