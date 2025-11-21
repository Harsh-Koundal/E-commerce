import Payment from "../models/payment.model.js";
import Order from "../models/Order.js";
import sendResponse from "../utils/sendResponse.js";

export const getVendorRevenue = async (req, res) => {
  try {
    const vendorId = req.vendor._id; //vendorAuth

    const revenueAgg = await Payment.aggregate([
      { $match: { vendorId, paymentStatus: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const totalOrders = revenueAgg[0]?.totalOrders || 0;

    //Pending settlements
    const pendingAgg = await Payment.aggregate([
      {
        $match: {
          vendorId,
          paymentStatus: "SUCCESS",
          "settlement.status": "PENDING",
        },
      },
      { $group: { _id: null, pendingSettlements: { $sum: "$amount" } } },
    ]);
    const pendingSettlements = pendingAgg[0]?.pendingSettlements || 0;

    //Monthly revenue (group by year+month)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { vendorId, paymentStatus: "SUCCESS" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    //Recent 5 orders (with payment info)
    const recentOrders = await Order.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .select("orderId totalCost status createdAt")
      .lean();

    return sendResponse(res, 200, "success", "Revenue fetched successfully", {
      totalRevenue,
      totalOrders,
      pendingSettlements,
      monthlyRevenue,
      recentOrders,
    });
  } catch (err) {
    return sendResponse(res, 500, "error", "Error fetching revenue data", {
      error: err.message,
    });
  }
};
