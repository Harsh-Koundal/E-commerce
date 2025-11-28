// assignAgentToOrder.js
import Order from "../models/Order.js";
import Agent from "../models/Agent.js";

export const assignAgentToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;       // URL se
    const { agentId } = req.body;         // body se

    if (!agentId) {
      return res.status(400).json({ success: false, message: "agentId is required" });
    }

    // UUID se agent find karo
    const agent = await Agent.findOne({ agentId });
    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent not found" });
    }

    // UUID based orderId search karo
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Agent assign karo (ObjectId)
    order.assignedAgent = agent._id;
    await order.save();

    // Optional: agent ke assignedOrders me bhi add kar sakte ho
    if (!agent.assignedOrders.includes(order._id)) {
      agent.assignedOrders.push(order._id);
      await agent.save();
    }

    res.status(200).json({
      success: true,
      message: "Agent assigned successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};