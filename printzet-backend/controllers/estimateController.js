// controllers/estimateController.js

export const getDeliveryEstimate = async (req, res) => {
  try {
    const { address, productType } = req.query;

    if (!address || !productType) {
      return res
        .status(400)
        .json({ message: "Address and product type are required" });
    }

    let etaDays = 5;

    // Simple logic
    if (productType === "prints") etaDays = 3;
    else if (productType === "accessories") etaDays = 4;

    res.json({
      etaDays,
      estimatedDelivery: new Date(
        Date.now() + etaDays * 86400000
      ).toDateString(),
    });
  } catch (err) {
    console.error("Delivery ETA error:", err);
    res.status(500).json({ message: "Error calculating delivery estimate" });
  }
};
