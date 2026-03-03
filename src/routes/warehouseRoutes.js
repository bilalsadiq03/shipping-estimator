const express = require("express");
const { getNearestWarehouse } = require("../controllers/warehouseController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/warehouse/nearest:
 *   get:
 *     summary: Get nearest warehouse for a seller
 *     tags: [Warehouse]
 *     parameters:
 *       - in: query
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: Nearest warehouse found
 *       400:
 *         description: Invalid seller ID
 *       404:
 *         description: Seller or warehouse not found
 */
router.get("/nearest", getNearestWarehouse);

module.exports = router;