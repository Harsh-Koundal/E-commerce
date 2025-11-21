import { findOne, findOneAndUpdate } from "../models/LoyaltyPoint.js";

export async function getPoints(req, res) {
  const userId = req.user._id;
  const points = (await findOne({ user: userId })) || {
    points: 0,
  };
  res.json({ points: points.points });
}

export async function redeemPoints(req, res) {
  const userId = req.user._id;
  const { redeemAmount } = req.body;
  const loyalty = await findOne({ user: userId });

  if (!loyalty || loyalty.points < redeemAmount) {
    return res.status(400).json({ message: "Not enough points" });
  }

  loyalty.points -= redeemAmount;
  await loyalty.save();
  res.json({ message: "Points redeemed", balance: loyalty.points });
}

// This would be called during order placement (hook or manually)
export async function addPointsOnOrder(userId, amount) {
  const pointsEarned = Math.floor(amount / 100); // Example: ₹100 = 1 point
  const loyalty = await findOneAndUpdate(
    { user: userId },
    { $inc: { points: pointsEarned } },
    { upsert: true, new: true }
  );
}
