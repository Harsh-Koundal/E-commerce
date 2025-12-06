// assignAgentToOrder.js
import Order from "../models/Order.js";
import Agent from "../models/Agent.js";
import Notification from "../models/Notification.js";

// POST /api/orders/assign/:orderId
export const assignAgentToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;   // URL se orderId
    const { agentId } = req.body;     // body se agentId

    if (!agentId) {
      return res.status(400).json({ success: false, message: "agentId is required" });
    }

    // Agent find karo agentId se
    const agent = await Agent.findOne({ agentId });
    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent not found" });
    }

    // Order find karo orderId se
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Agent assign karo order ko
    order.assignedAgent = agent._id;
    await order.save();

    // AssignedOrders update karo agent me
    if (!agent.assignedOrders.includes(order._id)) {
      agent.assignedOrders.push(order._id);
      await agent.save();
    }

    // Notification create karo
    const noti = await Notification.create({
      user: agent._id,
      title: "New Order Assigned",
      message: `You have been assigned order ${order.orderId}`
    });
    console.log("📩 Notification saved:", noti);

    // Response
    res.status(200).json({
      success: true,
      message: "Agent assigned successfully and notification sent",
      data: order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
