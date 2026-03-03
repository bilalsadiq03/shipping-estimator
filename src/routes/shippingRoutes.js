const express = require("express");
const { getShippingCharge, calculateShipping } = require("../controllers/shippingController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/shipping-charge:
 *   get:
 *     summary: Get shipping charge from warehouse to customer
 *     tags: [Shipping]
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: deliverySpeed
 *         required: true
 *         schema:
 *           type: string
 *           enum: [standard, express]
 *     responses:
 *       200:
 *         description: Shipping charge calculated
 */
router.get("/", getShippingCharge);

/**
 * @swagger
 * /api/v1/shipping-charge/calculate:
 *   post:
 *     summary: Calculate shipping for seller and customer
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sellerId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               deliverySpeed:
 *                 type: string
 *                 enum: [standard, express]
 *     responses:
 *       200:
 *         description: Shipping calculation successful
 */
router.post("/calculate", calculateShipping)

module.exports = router;