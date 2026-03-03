const express = require("express");
const { getShippingCharge, calculateShipping } = require("../controllers/shippingController");

const router = express.Router();

router.get("/", getShippingCharge);
router.post("/calculate", calculateShipping)

module.exports = router;