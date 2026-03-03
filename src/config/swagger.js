const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shipping Charge Estimator API",
      version: "1.0.0",
      description:
        "API documentation for B2B E-commerce Shipping Charge Estimator"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: ["./src/routes/*.js"] 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;