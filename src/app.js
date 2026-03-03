const express = require("express");
const cors = require("cors");
const warehouseRoutes = require("./routes/warehouseRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const errorHandler = require("./middlewares/errorMW");



const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler)

app.use("/api/v1/warehouse", warehouseRoutes);
app.use("/api/v1/shipping-charge", shippingRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Shipping Estimator API Running" });
});

module.exports = app;