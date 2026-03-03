const mongoose = require("mongoose");
const Seller = require("../models/seller");
const Product = require("../models/product");
const Warehouse = require("../models/warehouse");
const asyncHandler = require("../middlewares/asyncHandler");
const cache = require("../utils/cache");

// @desc    Get nearest warehouse for a seller
// @route   GET /api/v1/warehouse/nearest
// @access  Public
const getNearestWarehouse = asyncHandler(async (req, res) => {
  const { sellerId, productId } = req.query;

  //  Validate required field
  if (!sellerId) {
    res.status(400);
    throw new Error("sellerId is required");
  }

  //  Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    res.status(400);
    throw new Error("Invalid sellerId format");
  }

  //  Check cache first
  const cacheKey = `nearest_${sellerId}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json({
      success: true,
      source: "cache",
      ...cachedData
    });
  }

  // Fetch seller
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  //  Optional: Validate product belongs to seller
  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("Invalid productId format");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found for this seller");
    }
  }

  //  Find nearest warehouse using Geo Query
  const nearestWarehouse = await Warehouse.findOne({
    location: {
      $near: {
        $geometry: seller.location
      }
    }
  }).lean();

  if (!nearestWarehouse) {
    res.status(404);
    throw new Error("No warehouses available");
  }

  const response = {
    warehouseId: nearestWarehouse._id,
    warehouseLocation: nearestWarehouse.location
  };

  //  Store in cache (5 min TTL from cache config)
  cache.set(cacheKey, response);

  return res.json({
    success: true,
    source: "database",
    ...response
  });
});

module.exports = {
  getNearestWarehouse
};