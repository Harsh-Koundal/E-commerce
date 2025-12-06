import Order from "../models/Order.js";
import { v4 as uuidv4 } from 'uuid'; 
import Payment from "../models/payment.model.js";
import sendResponse from "../utils/sendResponse.js";

const trackOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json("Order not found");
        }
        
        // Check if the order has a successful payment
        const payment = await Payment.findOne({ 
            orderId: order._id, 
            paymentStatus: "SUCCESS" 
        });
        
        if (!payment) {
            return res.status(404).json("Order not found or payment not completed");
        }
        
        return res.status(200).json({ message:"Fetched order Status",status: order.status});
    } catch (error) {
        console.error("Error tracking order:", error);
        return res.status(500).json("Server error");
    }
};

const reOrder = async (req, res) => {
    try {
        const oldOrder = await Order.findById(req.params.id);
        if (!oldOrder) {
            return res.status(404).json({ message: "Original order not found" });
        }
        
        // Check if the original order has a successful payment
        const payment = await Payment.findOne({ 
            orderId: oldOrder._id, 
            paymentStatus: "SUCCESS" 
        });
        
        if (!payment) {
            return res.status(404).json({ message: "Original order not found or payment not completed" });
        }

        const clonedOrderData = oldOrder.toObject();
        delete clonedOrderData._id;
        delete clonedOrderData.createdAt;
        delete clonedOrderData.updatedAt;

        clonedOrderData.orderId = uuidv4();
        clonedOrderData.status = 'pending';
        clonedOrderData.transactionId = uuidv4(); 

        const newOrder = new Order(clonedOrderData);
        await newOrder.save();

        return res.status(201).json({ message: "Reorder placed", order: newOrder });

    } catch (error) {
        console.error("Error while reordering:", error)
        return res.status(500).json("Server error")        
    }
}

const customiseReorder = async (req, res) => {
    try {
        const oldOrder = await Order.findById(req.params.id);
        if (!oldOrder) {
            return res.status(404).json({ message: "Original order not found" });
        }
        
        // Check if the original order has a successful payment
        const payment = await Payment.findOne({ 
            orderId: oldOrder._id, 
            paymentStatus: "SUCCESS" 
        });
        
        if (!payment) {
            return res.status(404).json({ message: "Original order not found or payment not completed" });
        }

        const updates = req.body;
        const allowedUpdates = ['numCopies', 'colorType', 'printQuality', 'paperType', 'binding', 'lamination', 'printedSides'];
        for (let key of Object.keys(updates)) {
            if (!allowedUpdates.includes(key)) {
                return res.status(400).json({ message: `Invalid update field: ${key}` });
            }
        }

        const clonedOrderData = oldOrder.toObject();
        delete clonedOrderData._id;
        delete clonedOrderData.createdAt;
        delete clonedOrderData.updatedAt;

        clonedOrderData.orderId = uuidv4();
        clonedOrderData.status = 'pending';
        clonedOrderData.transactionId = uuidv4();

        for (let key of Object.keys(updates)) {
            clonedOrderData[key] = updates[key];
        }

        const newOrder = new Order(clonedOrderData);
        await newOrder.save();

        return res.status(201).json({ message: "Custom reorder placed", order: newOrder });

    } catch (error) {
        console.error("Error while custom reordering:", error)
        return res.status(500).json("Server error")        
    }
}

const previewOrder = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        } 
        
        // Check if the order has a successful payment
        const payment = await Payment.findOne({ 
            orderId: order._id, 
            paymentStatus: "SUCCESS" 
        });
        
        if (!payment) {
            return res.status(404).json({ message: "Order not found or payment not completed" });
        }
        
        return res.status(200).json({ message: "Order preview", order });

    } catch (error) {
        console.error("Error while generating preview:", error)
        return res.status(500).json("Server error")        
    }
  }

const getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId vendor");
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Check if the order has a successful payment
    const payment = await Payment.findOne({ 
      orderId: order._id, 
      paymentStatus: "SUCCESS" 
    });
    
    if (!payment) {
      return res.status(404).json({ message: "Order not found or payment not completed" });
    }

    const invoice = {
      invoiceId: `INV-${order.orderId}`,
      orderId: order.orderId,
      date: order.createdAt,
      customer: order.customerDetails,
      printSettings: {
        paperType: order.paperType,
        printQuality: order.printQuality,
        binding: order.binding,
        lamination: order.lamination,
        printedSides: order.printedSides,
        numCopies: order.numCopies,
        colorType: order.colorType,
      },
      files: order.files,
      totalPages: order.totalPages,
      totalCost: order.totalCost,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
      vendor: order.vendor?.name || "N/A",
    };

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

// Get user order history
const getOrderHistory = async (req, res) => {
  try {
    // Get the correct user ID (handle both regular and Google auth)
    const userId = req.userId || req.user?.id;
    
    // First get all successful payment records for this user
    const successfulPayments = await Payment.find({ 
      userId: userId, 
      paymentStatus: "SUCCESS" 
    }).select("orderId");
    
    // Extract order IDs from successful payments
    const paidOrderIds = successfulPayments.map(payment => payment.orderId);
    
    // Find orders that have successful payments
    const orders = await Order.find({ 
      userId: userId,
      _id: { $in: paidOrderIds }
    })
      .populate("categoryId", "name description")
      .populate("vendor", "name email phone address")
      .populate("assignedAgent", "name phone")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200,  "Order history fetched","success", orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return sendResponse(res, 500, "Server error while fetching history", "error" );
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    // Get the correct user ID (handle both regular and Google auth)
    const userId = req.userId || req.user?.id;
    
    const order = await Order.findOne({ _id: req.params.id, userId: userId })
      .populate("categoryId", "name description")
      .populate("vendor", "name email phone address")
      .populate("assignedAgent", "name phone");

    if (!order) return sendResponse(res, 404, "error", "Order not found");
    
    // Check if the order has a successful payment
    const payment = await Payment.findOne({ 
      orderId: order._id, 
      paymentStatus: "SUCCESS" 
    });
    
    if (!payment) {
      return sendResponse(res, 404, "error", "Order not found or payment not completed");
    }

    return sendResponse(res, 200,  "Order details fetched","success", order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return sendResponse(res, 500, "Server error while fetching order","error");
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    // Get the correct user ID (handle both regular and Google auth)
    const userId = req.userId || req.user?.id;
    
    const payments = await Payment.find({ userId: userId })
      .populate("orderId")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, "Payment history fetched", "success", payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return sendResponse(res, 500, "Server error while fetching payments", "error");
  }
};

const deleteOrder = async(req,res,next)=>{
  try{
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if(!order) return res.status(404).json({message:"Order not found"});

    const payment = await Payment.findOne({
      orderId:order._id,
      paymentStatus:"SUCCESS"
    });

    if(!payment) return res.status(404).json({message:"Cannot delete order. Payment not completed or order invalid."});

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({message:"Order deleted successfully"});
  }catch(err){
    console.error("Error deleting order:", err);
    return sendResponse(res, 500, "Server error while deleting order");
  }
}



export {
    trackOrder, reOrder, getInvoice,
    getOrderHistory, getOrderDetails, getPaymentHistory,customiseReorder
    ,previewOrder,deleteOrder
}