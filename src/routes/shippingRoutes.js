const express = require("express");
const { getShippingCharge } = require("../controllers/shippingController");

const router = express.Router();

router.get("/", getShippingCharge);

module.exports = router;