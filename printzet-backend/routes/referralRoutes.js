const express = require("express");
const {
  useReferral,
  generateCode,
} = require("../controllers/referralController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/referral/use-code", auth, useReferral);
router.post("/referral/generate-code", auth, generateCode);

module.exports = router;
