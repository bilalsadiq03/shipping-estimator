const calculateDistance = require("../utils/distance");
const { getTransportStrategy } = require("../utils/transportStrategy");

function calculateShippingCharge({
  warehouseLocation,
  customerLocation,
  weight,
  deliverySpeed
}) {
  if (!warehouseLocation || !customerLocation)
    throw new Error("Invalid locations provided");

  if (!weight || weight <= 0)
    throw new Error("Invalid product weight");

  const distance = calculateDistance(
    warehouseLocation.coordinates,
    customerLocation.coordinates
  );

  const transportStrategy = getTransportStrategy(distance);

  let shippingCharge = transportStrategy.calculate(distance, weight);

  shippingCharge += 10;

  if (deliverySpeed === "express") {
    shippingCharge += weight * 1.2;
  }

  if (deliverySpeed !== "standard" && deliverySpeed !== "express") {
    throw new Error("Unsupported delivery speed");
  }

  return {
    distance: Number(distance.toFixed(2)),
    shippingCharge: Number(shippingCharge.toFixed(2))
  };
}

module.exports = {
  calculateShippingCharge
};