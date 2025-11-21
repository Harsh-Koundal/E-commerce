import Delivery from "../models/Delivery.js";
import sendResponse from "../utils/sendResponse.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Agent from "../models/Agent.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ---------------------- Email Config ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Email transporter error:", error);
  }
});

// ---------------------- Assign Delivery ----------------------
const assignDelivery = async (req, res) => {
  try {
    const { orderId, agentId, estimatedTime } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendResponse(res, 404, "Order not found", null, null);
    }

    if (order.status !== "pending") {
      return sendResponse(res, 400, "Order not ready for delivery", null, null);
    }

    const delivery = new Delivery({
      order: orderId,
      deliveryPartner: agentId,
      trackingId: uuidv4(),
      status: "assigned",
      deliveryAddress: order.customerDetails,
      estimatedDelivery: estimatedTime,
    });

    await delivery.save();
    
      // Update Order document
    order.assignedAgent = agentId;
    order.status = "assigned";
    await order.save();

    // Update Agent document 
    const agent = await Agent.findById(agentId);
    if(agent){
        agent.assignedOrders.push(orderId);
        await agent.save();
    }
 
    const deliveryPartner = await User.findById(agentId);
    if (deliveryPartner && deliveryPartner.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: deliveryPartner.email,
        subject: "New Delivery Assigned",
        html: `
          <h3>Hello ${deliveryPartner.fullName},</h3>
          <p>You have been assigned a new delivery.</p>
          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>Tracking ID:</b> ${delivery.trackingId}</p>
          <p><b>Delivery Address:</b> ${order.customerDetails.address}</p>
          <p><b>Estimated Delivery:</b> ${estimatedTime}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return sendResponse(res, 200, "Delivery assigned successfully", "success", delivery);
  } catch (error) {
    return sendResponse(res, 500, "Error assigning delivery", null, error.message);
  }
};

// ---------------------- Nearby Delivery Partners ----------------------
const getNearbyDeliveryPartners = async (req, res) => {
  try {
    const { orderId } = req.query;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendResponse(res, 404, "Order not found", null, null);
    }

    const { city, state, pincode } = order.customerDetails;

    const partners = await User.find({
      isEmployee: true,
      "address.city": city,
      "address.state": state,
      "address.pincode": pincode,
    });

    return sendResponse(res, 200, "Nearby delivery partners fetched", "success", { order, partners });
  } catch (error) {
    return sendResponse(res, 500, "Error fetching nearby delivery partners", null, error.message);
  }
};

// ---------------------- Update Delivery Status ----------------------
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, proofOfDelivery, issue } = req.body;

    const delivery = await Delivery.findById(id).populate({
      path: "order",
      populate: [
        { path: "user", select: "fullName email mobile address" },
        { path: "vendor", select: "name email mobile address" },
      ],
    });

    if (!delivery) {
      return sendResponse(res, 404, "Delivery not found", null, null);
    }

    if (status) delivery.status = status;
    if (proofOfDelivery) delivery.proofOfDelivery = proofOfDelivery;

    if (issue) {
      delivery.issues.push({ description: issue });

      const adminUsers = await User.find({ isAdmin: true });
      if (adminUsers.length > 0) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: adminUsers.map((a) => a.email),
          subject: "🚨 Delivery Issue Reported",
          html: `
            <h3>New Delivery Issue Reported</h3>
            <p><b>Delivery ID:</b> ${delivery._id}</p>
            <p><b>Order ID:</b> ${delivery.order?._id || "N/A"}</p>
            <p><b>Tracking ID:</b> ${delivery.trackingId}</p>
            <p><b>Issue:</b> ${issue}</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    await delivery.save();
    return sendResponse(res, 200, "Delivery updated successfully", "success", delivery);
  } catch (error) {
    return sendResponse(res, 500, "Error updating delivery", null, error.message);
  }
};

// ---------------------- Get In Progress Deliveries ----------------------
const getInProgressDeliveries = async (req, res) => {
  try {
    const inProgressDeliveries = await Delivery.find({
      status: { $in: ["assigned", "picked_up", "in_transit", "out_for_delivery"] },
    })
      .populate({
        path: "order",
        select: "orderId customerDetails totalCost status user vendor",
        populate: [
          { path: "user", select: "fullName email mobile address" },
          { path: "vendor", select: "name email mobile address" },
        ],
      })
      .populate("deliveryPartner", "fullName email mobile address");

    return sendResponse(res, 200, "In-progress deliveries fetched", "success", inProgressDeliveries);
  } catch (error) {
    return sendResponse(res, 500, "Error fetching in-progress deliveries", null, error.message);
  }
};

// ---------------------- Get Single Delivery ----------------------
const getDeliveries = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id)
      .populate({
        path: "order",
        select: "orderId customerDetails totalCost status user vendor",
        populate: [
          { path: "user", select: "fullName email mobile address" },
          { path: "vendor", select: "name email mobile address" },
        ],
      })
      .populate("deliveryPartner", "fullName email mobile address");

    if (!delivery) {
      return sendResponse(res, 404, "Delivery details not found", null, null);
    }

    return sendResponse(res, 200, "Fetch delivery data successfully", "success", delivery);
  } catch (error) {
    return sendResponse(res, 500, "Error fetching delivery details", null, error.message);
  }
};

const deliveryController = {
  getInProgressDeliveries,
  getNearbyDeliveryPartners,
  updateDeliveryStatus,
  assignDelivery,
  getDeliveries,
};

export default deliveryController;