const mongoose = require("mongoose");
const Warehouse = require("../models/warehouse");
const Customer = require("../models/Customer");
const Seller = require("../models/seller")
const Product = require("../models/product")
const { calculateShippingCharge } = require("../services/shippingServices");

const getShippingCharge = async (req, res) => {
  try {
    const { warehouseId, customerId, deliverySpeed } = req.query;

    // Validate required fields
    if (!warehouseId || !customerId || !deliverySpeed)
      return res.status(400).json({
        error: "warehouseId, customerId and deliverySpeed are required"
      });

    //  Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(warehouseId))
      return res.status(400).json({ error: "Invalid warehouseId format" });

    if (!mongoose.Types.ObjectId.isValid(customerId))
      return res.status(400).json({ error: "Invalid customerId format" });

    //  Fetch data
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse)
      return res.status(404).json({ error: "Warehouse not found" });

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ error: "Customer not found" });

    //  For this API, assume weight = 10kg (temporary)
    const weight = 10;

    //  Calculate shipping
    const result = calculateShippingCharge({
      warehouseLocation: warehouse.location,
      customerLocation: customer.location,
      weight,
      deliverySpeed
    });

    return res.json({
      shippingCharge: result.shippingCharge,
      distanceInKm: result.distance
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const calculateShipping = async (req, res) => {
  try {
    const { sellerId, customerId, deliverySpeed } = req.body;

    // Validate required fields
    if (!sellerId || !customerId || !deliverySpeed)
      return res.status(400).json({
        error: "sellerId, customerId and deliverySpeed are required"
      });

    //  Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(sellerId))
      return res.status(400).json({ error: "Invalid sellerId format" });

    if (!mongoose.Types.ObjectId.isValid(customerId))
      return res.status(400).json({ error: "Invalid customerId format" });

    // Fetch Seller
    const seller = await Seller.findById(sellerId);
    if (!seller)
      return res.status(404).json({ error: "Seller not found" });

    // Fetch Product (Assume seller has one product for now)
    const product = await Product.findOne({ seller: sellerId });
    if (!product)
      return res.status(404).json({ error: "No product found for seller" });

    //  Fetch Customer
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ error: "Customer not found" });

    //  Find nearest warehouse
    const nearestWarehouse = await Warehouse.findOne({
      location: {
        $near: {
          $geometry: seller.location
        }
      }
    });

    if (!nearestWarehouse)
      return res.status(404).json({ error: "No warehouses available" });

    //  Calculate shipping using real product weight
    const result = calculateShippingCharge({
      warehouseLocation: nearestWarehouse.location,
      customerLocation: customer.location,
      weight: product.weight,
      deliverySpeed
    });

    return res.json({
      shippingCharge: result.shippingCharge,
      distanceInKm: result.distance,
      nearestWarehouse: {
        warehouseId: nearestWarehouse._id,
        warehouseLocation: nearestWarehouse.location
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getShippingCharge,
  calculateShipping
};