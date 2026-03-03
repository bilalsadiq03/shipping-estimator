const mongoose = require("mongoose");
const Warehouse = require("../models/warehouse");
const Customer = require("../models/Customer");
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

module.exports = {
  getShippingCharge
};