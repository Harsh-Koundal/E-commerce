export const getEarnings = async (req, res) => {
  // TODO: Fetch earnings from DB
  res.json({ totalEarnings: 5400, weekly: 1200, cashToCollect: 800 });
};
