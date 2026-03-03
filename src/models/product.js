const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);