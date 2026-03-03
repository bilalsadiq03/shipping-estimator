const Seller = require("../models/seller");
const Product = require("../models/product");
const Warehouse = require("../models/warehouse");

const getNearestWarehouse = async (req, res) => {
  try {
    const { sellerId, productId } = req.query;

    if (!sellerId)
      return res.status(400).json({ error: "sellerId is required" });

    // 1. Validate Seller
    const seller = await Seller.findById(sellerId);
    if (!seller)
      return res.status(404).json({ error: "Seller not found" });

    // 2. Optional: Validate Product belongs to seller
    if (productId) {
      const product = await Product.findOne({
        _id: productId,
        seller: sellerId
      });

      if (!product)
        return res
          .status(404)
          .json({ error: "Product not found for this seller" });
    }

    // 3. Find nearest warehouse using Geo Query
    const nearestWarehouse = await Warehouse.findOne({
      location: {
        $near: {
          $geometry: seller.location
        }
      }
    });

    if (!nearestWarehouse)
      return res.status(404).json({ error: "No warehouses available" });

    return res.json({
      warehouseId: nearestWarehouse._id,
      warehouseLocation: nearestWarehouse.location
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNearestWarehouse
};