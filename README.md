# E-Commerce Shipping Charge Estimator (Backend Service)

A production-ready backend service built using **Node.js, Express, and MongoDB** to calculate shipping charges for a B2B e-commerce marketplace serving Kirana stores across India.

This project implements APIs to:

- Find the nearest warehouse for a seller
- Calculate shipping charges based on distance and transport mode
- Combine seller, warehouse, and customer logic into a unified shipping calculation

---

# Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Joi (Validation)**
- **Node-Cache (Caching)**
- **2dsphere Geo Indexing**
- **Haversine Formula**
- **Strategy Design Pattern**

---

# Project Architecture
shipping-estimator/  
│  
├── src/  
│ ├── config/  
│ │ └── db.js  
│ │  
│ ├── controllers/  
│ │ ├── warehouseController.js  
│ │ └── shippingController.js  
│ │  
│ ├── services/  
│ │ └── shippingService.js  
│ │  
│ ├── models/  
│ │ ├── Customer.js  
│ │ ├── Seller.js  
│ │ ├── Product.js  
│ │ └── Warehouse.js  
│ │  
│ ├── routes/  
│ │ ├── warehouseRoutes.js  
│ │ └── shippingRoutes.js  
│ │  
│ ├── middlewares/  
│ │ ├── asyncHandler.js  
│ │ └── errorMiddleware.js  
│ │  
│ ├── utils/  
│ │ ├── distance.js  
│ │ ├── transportStrategy.js  
│ │ ├── validators.js  
│ │ └── cache.js  
│ │  
│ ├── seed.js  
│ └── app.js  
│  
├── server.js  
├── .env  
└── package.json

  
---  
  
#  Core Concepts Implemented  
  
## 1 Geo-Spatial Queries  
  
MongoDB `2dsphere` index is used to find the nearest warehouse using:  
  
```bash
$near
```

---

## 2 Distance Calculation

Haversine formula is used to calculate distance between warehouse and customer coordinates.

---

## 3 Strategy Pattern (Transport Mode Selection)

Transport mode is selected dynamically based on distance:

| Distance (KM) | Mode | Rate (₹ / km / kg) |
| --- | --- | --- |
| 0–100 | Mini Van | 3 |
| 100–500 | Truck | 2 |
| 500+ | Aeroplane | 1 |

---

## 4 Delivery Speed Charges

| Delivery Type | Extra Charge |
| --- | --- |
| Standard | ₹10 |
| Express | ₹10 + ₹1.2 per kg |

---

## 5 Caching

Nearest warehouse responses are cached for 5 minutes using in-memory caching.

* * *

#  Installation & Setup

## 1 Clone Repository

```bash
git clone https://github.com/bilalsadiq03/shipping-estimator.git  
cd shipping-charge-estimator
```

---

## 2 Install Dependencies

```bash
npm install
```


## 3 Setup Environment Variables

Create `.env` file:

```bash
PORT=5000  
MONGO\_URI=mongodb://localhost:27017/shipping-estimator
```


## 4 Seed Database
```bash
npm run seed
```

This will create:

*   1 Seller
    
*   1 Product
    
*   1 Customer
    
*   1 Warehouse
    

* * *

## 5️⃣ Start Server

npm run dev

Server runs at:

http://localhost:5000

* * *

# 🔗 API Endpoints

* * *

##  Health Check

### GET `/api/health`

### Response
```bash

{  
  "message": "Shipping Estimator API Running"  
}
```

* * *

##  Get Nearest Warehouse

### GET `/api/v1/warehouse/nearest?sellerId=<sellerId>`

### Response
```bash

{  
  "success": true,  
  "source": "database",  
  "warehouseId": "abc123",  
  "warehouseLocation": {  
    "type": "Point",  
    "coordinates": \[77.59, 12.97\]  
  }  
}
```

### If cached:

```bash
{  
  "success": true,  
  "source": "cache",  
  "warehouseId": "abc123",  
  "warehouseLocation": {  
    "type": "Point",  
    "coordinates": \[77.59, 12.97\]  
  }  
}
```

* * *

##  Get Shipping Charge

### GET `/api/v1/shipping-charge?warehouseId=<id>&customerId=<id>&deliverySpeed=standard`

### Response
```bash

{  
  "shippingCharge": 120.45,  
  "distanceInKm": 25.67  
}
```

* * *

##  Combined Shipping Calculation

### POST `/api/v1/shipping-charge/calculate`

### Request Body
```bash

{  
  "sellerId": "seller\_id",  
  "customerId": "customer\_id",  
  "deliverySpeed": "express"  
}
```

### Response
```bash
{  
  "shippingCharge": 145.32,  
  "distanceInKm": 30.12,  
  "nearestWarehouse": {  
    "warehouseId": "warehouse\_id",  
    "warehouseLocation": {  
      "type": "Point",  
      "coordinates": \[77.59, 12.97\]  
    }  
  }  
}
```

* * *

#  Error Handling

All APIs return structured errors:
```bash
{  
  "success": false,  
  "message": "Invalid sellerId format"  
}
```
### Validation Includes:

*   Invalid ObjectId
    
*   Missing parameters
    
*   Unsupported delivery speed
    
*   No warehouse found
    
*   No seller found
    

* * *

#  Testing Flow

1.  Run `npm run seed`
    
2.  Start server
    
3.  Copy IDs from MongoDB Compass
    
4.  Test APIs using Postman
    

* * *

#  Performance Optimizations

*   Geo-indexed queries
    
*   In-memory caching
    
*   Lean queries (`.lean()`) for performance
    
*   Service-layer architecture
    

* * *

#  Future Improvements

*   Redis caching
    
*   Swagger API documentation
    
*   Jest unit tests
    
*   Docker support
    
*   Authentication layer
    
*   Multi-product order support
    
*   Pagination for large datasets
