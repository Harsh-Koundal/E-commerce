import Order from "../models/Order.js";

// GET /orders/assigned
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedAgent: req.userId })
      .populate("vendor", "name email phone") // vendor info optional
      .populate("customerDetails"); // customer info
    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check if logged-in agent is assigned to this order
    if (order.assignedAgent.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
