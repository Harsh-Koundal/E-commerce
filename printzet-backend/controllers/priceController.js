export const getPriceEstimate = async (req, res) => {
  try {
    const { quantity = 1, size, finish } = req.body;

    let basePrice = 250; // or calculate based on size/finish
    let discount = 0;

    // 🎯 Bulk Discount Logic
    if (quantity >= 50) discount = 0.15;
    else if (quantity >= 20) discount = 0.1;
    else if (quantity >= 10) discount = 0.05;

    const discountedPrice = basePrice - basePrice * discount;

    // 🚚 Shipping Logic
    let shippingFee = 30;
    if (quantity >= 50) shippingFee = 0;
    else if (quantity >= 20) shippingFee = 20;

    const total = discountedPrice + shippingFee;

    res.json({
      basePrice,
      discount: discount * 100,
      finalPrice: discountedPrice,
      shippingFee,
      totalPayable: total,
    });
  } catch (error) {
    console.error("Price estimation error:", error);
    res.status(500).json({ message: "Error estimating price" });
  }
};
