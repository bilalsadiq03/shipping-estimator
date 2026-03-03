require("dotenv").config();
const connectDB = require("./config/db");

const Seller = require("./models/seller");
const Customer = require("./models/customer");
const Warehouse = require("./models/warehouse");
const Product = require("./models/product");

const seed = async () => {
  await connectDB();

  await Seller.deleteMany();
  await Customer.deleteMany();
  await Warehouse.deleteMany();
  await Product.deleteMany();

  const seller = await Seller.create({
    name: "Nestle Seller",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716]
    }
  });

  const product = await Product.create({
    name: "Maggie 500g",
    seller: seller._id,
    price: 10,
    weight: 0.5
  });

  await Customer.create({
    name: "Shree Kirana Store",
    phone: "9847000000",
    location: {
      type: "Point",
      coordinates: [77.6, 13.0]
    }
  });

  await Warehouse.create({
    name: "BLR_Warehouse",
    location: {
      type: "Point",
      coordinates: [77.59, 12.97]
    }
  });

  console.log("Database Seeded");
  process.exit();
};

seed();