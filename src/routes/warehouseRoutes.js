const express = require("express");
const { getNearestWarehouse } = require("../controllers/warehouseController");

const router = express.Router();

router.get("/nearest", getNearestWarehouse);

module.exports = router;