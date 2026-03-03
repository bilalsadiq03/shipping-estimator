const Joi = require("joi");

const calculateShippingSchema = Joi.object({
  sellerId: Joi.string().required(),
  customerId: Joi.string().required(),
  deliverySpeed: Joi.string()
    .valid("standard", "express")
    .required()
});

module.exports = {
  calculateShippingSchema
};