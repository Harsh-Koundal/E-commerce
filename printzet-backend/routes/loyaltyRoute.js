const express = require("express");
const { getPoints, redeemPoints } = require("../controllers/loyaltyController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/user/points", auth, getPoints);
router.post("/user/redeem", auth, redeemPoints);

module.exports = router;
