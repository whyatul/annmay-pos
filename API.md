# 📡 API Documentation - Restaurant POS System

## Base URL
```
http://localhost:8000/api
```

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Orders](#orders)
4. [Tables](#tables)
5. [Payments](#payments)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)

---

## Authentication

All authenticated endpoints require a valid JWT token in cookies.

### Token Storage
- Token is stored in HTTP-only cookie named `accessToken`
- Token expires after 24 hours
- Token is automatically sent with requests

---

## Users

### 1. Register User

**Endpoint:** `POST /api/user/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@restaurant.com",
  "phone": 9876543210,
  "password": "password123",
  "role": "waiter"
}
```

**Roles:** `admin`, `manager`, `waiter`, `chef`, `cashier`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "New user created!",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@restaurant.com",
    "phone": 9876543210,
    "role": "waiter",
    "createdAt": "2026-02-18T10:30:00.000Z",
    "updatedAt": "2026-02-18T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - User already exists

---

### 2. Login User

**Endpoint:** `POST /api/user/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User login successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@restaurant.com",
    "phone": 9876543210,
    "role": "admin",
    "createdAt": "2026-02-18T10:00:00.000Z",
    "updatedAt": "2026-02-18T10:00:00.000Z"
  }
}
```

**Note:** JWT token is set in HTTP-only cookie

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials

---

### 3. Get Current User

**Endpoint:** `GET /api/user/me`

**Description:** Get logged-in user's data

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@restaurant.com",
    "phone": 9876543210,
    "role": "admin",
    "createdAt": "2026-02-18T10:00:00.000Z",
    "updatedAt": "2026-02-18T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No token provided
- `401 Unauthorized` - Invalid token

---

### 4. Logout User

**Endpoint:** `POST /api/user/logout`

**Description:** Logout user and clear token

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User logout successfully!"
}
```

---

## Orders

### 1. Get All Orders

**Endpoint:** `GET /api/order`

**Description:** Retrieve all orders

**Authentication:** Required

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `in-progress`, `ready`, `completed`, `cancelled`
- `tableId` (optional) - Filter by table ID
- `limit` (optional) - Limit number of results
- `page` (optional) - Page number for pagination

**Example:**
```
GET /api/order?status=pending&limit=10&page=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-001",
      "customer": {
        "name": "John Doe",
        "phone": 9876543210,
        "email": "john@example.com"
      },
      "items": [
        {
          "name": "Butter Chicken",
          "price": 400,
          "quantity": 2,
          "total": 800
        }
      ],
      "table": {
        "_id": "507f1f77bcf86cd799439012",
        "tableNumber": 5
      },
      "status": "pending",
      "subtotal": 800,
      "tax": 144,
      "total": 944,
      "createdAt": "2026-02-18T10:30:00.000Z",
      "updatedAt": "2026-02-18T10:30:00.000Z"
    }
  ],
  "totalOrders": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

---

### 2. Create Order

**Endpoint:** `POST /api/order`

**Description:** Create a new order

**Authentication:** Required

**Request Body:**
```json
{
  "customer": {
    "name": "John Doe",
    "phone": 9876543210,
    "email": "john@example.com"
  },
  "items": [
    {
      "id": 1,
      "name": "Butter Chicken",
      "price": 400,
      "quantity": 2,
      "category": "Non-Vegetarian"
    },
    {
      "id": 5,
      "name": "Garlic Naan",
      "price": 60,
      "quantity": 4,
      "category": "Vegetarian"
    }
  ],
  "tableId": "507f1f77bcf86cd799439012",
  "specialInstructions": "Less spicy"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-002",
    "customer": {
      "name": "John Doe",
      "phone": 9876543210,
      "email": "john@example.com"
    },
    "items": [...],
    "table": "507f1f77bcf86cd799439012",
    "status": "pending",
    "subtotal": 1040,
    "tax": 187.2,
    "total": 1227.2,
    "specialInstructions": "Less spicy",
    "createdAt": "2026-02-18T10:35:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Table not found

---

### 3. Get Order by ID

**Endpoint:** `GET /api/order/:id`

**Description:** Get specific order details

**Authentication:** Required

**Example:**
```
GET /api/order/507f1f77bcf86cd799439013
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-002",
    "customer": {...},
    "items": [...],
    "table": {...},
    "status": "in-progress",
    "subtotal": 1040,
    "tax": 187.2,
    "total": 1227.2,
    "createdAt": "2026-02-18T10:35:00.000Z",
    "updatedAt": "2026-02-18T10:40:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Order not found

---

### 4. Update Order

**Endpoint:** `PUT /api/order/:id`

**Description:** Update order status or details

**Authentication:** Required

**Request Body:**
```json
{
  "status": "ready"
}
```

**Valid Statuses:**
- `pending` - Order placed
- `in-progress` - Being prepared
- `ready` - Ready for serving
- `completed` - Order completed
- `cancelled` - Order cancelled

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order updated successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "ready",
    "updatedAt": "2026-02-18T10:45:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Order not found
- `400 Bad Request` - Invalid status

---

### 5. Delete Order

**Endpoint:** `DELETE /api/order/:id`

**Description:** Delete/cancel an order

**Authentication:** Required (Admin/Manager only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order deleted successfully!"
}
```

**Error Responses:**
- `404 Not Found` - Order not found
- `403 Forbidden` - Insufficient permissions

---

## Tables

### 1. Get All Tables

**Endpoint:** `GET /api/table`

**Description:** Get all restaurant tables

**Authentication:** Required

**Query Parameters:**
- `status` (optional) - Filter by status: `available`, `occupied`, `reserved`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "tableNumber": 1,
      "seats": 4,
      "status": "available",
      "currentOrder": null,
      "createdAt": "2026-02-18T09:00:00.000Z",
      "updatedAt": "2026-02-18T09:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "tableNumber": 2,
      "seats": 6,
      "status": "occupied",
      "currentOrder": "507f1f77bcf86cd799439013",
      "createdAt": "2026-02-18T09:00:00.000Z",
      "updatedAt": "2026-02-18T10:35:00.000Z"
    }
  ]
}
```

---

### 2. Create Table

**Endpoint:** `POST /api/table`

**Description:** Add a new table

**Authentication:** Required (Admin/Manager only)

**Request Body:**
```json
{
  "tableNumber": 21,
  "seats": 4
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Table created successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "tableNumber": 21,
    "seats": 4,
    "status": "available",
    "currentOrder": null,
    "createdAt": "2026-02-18T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Table number already exists

---

### 3. Get Table by ID

**Endpoint:** `GET /api/table/:id`

**Description:** Get specific table details

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "tableNumber": 1,
    "seats": 4,
    "status": "available",
    "currentOrder": null,
    "createdAt": "2026-02-18T09:00:00.000Z",
    "updatedAt": "2026-02-18T09:00:00.000Z"
  }
}
```

---

### 4. Update Table

**Endpoint:** `PUT /api/table/:id`

**Description:** Update table details or status

**Authentication:** Required

**Request Body:**
```json
{
  "status": "occupied",
  "currentOrder": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Table updated successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "occupied",
    "currentOrder": "507f1f77bcf86cd799439013",
    "updatedAt": "2026-02-18T11:05:00.000Z"
  }
}
```

---

### 5. Delete Table

**Endpoint:** `DELETE /api/table/:id`

**Description:** Remove a table

**Authentication:** Required (Admin/Manager only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Table deleted successfully!"
}
```

---

## Payments

### 1. Create Payment Order

**Endpoint:** `POST /api/payment/create-order`

**Description:** Create a Razorpay order for payment

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439013",
  "amount": 1227.2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_xyz123",
    "amount": 122720,
    "currency": "INR",
    "keyId": "rzp_test_...",
    "orderId": "507f1f77bcf86cd799439013"
  }
}
```

---

### 2. Verify Payment

**Endpoint:** `POST /api/payment/verify`

**Description:** Verify Razorpay payment signature

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439013",
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "razorpaySignature": "signature_hash"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "orderId": "507f1f77bcf86cd799439013",
    "razorpayOrderId": "order_xyz123",
    "razorpayPaymentId": "pay_abc456",
    "amount": 1227.2,
    "status": "completed",
    "createdAt": "2026-02-18T11:10:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid signature

---

### 3. Get All Payments

**Endpoint:** `GET /api/payment`

**Description:** Get all payment records

**Authentication:** Required (Admin/Manager/Cashier only)

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `completed`, `failed`, `refunded`
- `startDate` (optional) - Filter from date
- `endDate` (optional) - Filter to date

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "orderId": {
        "_id": "507f1f77bcf86cd799439013",
        "orderNumber": "ORD-002"
      },
      "razorpayOrderId": "order_xyz123",
      "razorpayPaymentId": "pay_abc456",
      "amount": 1227.2,
      "status": "completed",
      "createdAt": "2026-02-18T11:10:00.000Z"
    }
  ],
  "totalAmount": 15000,
  "totalPayments": 12
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| AUTHENTICATION_ERROR | Authentication failed |
| AUTHORIZATION_ERROR | Insufficient permissions |
| NOT_FOUND | Resource not found |
| DUPLICATE_ERROR | Resource already exists |
| SERVER_ERROR | Internal server error |

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Header:** `X-RateLimit-Remaining` shows remaining requests

---

## Pagination

For endpoints that support pagination:

**Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 100)

**Response includes:**
```json
{
  "data": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 50,
  "itemsPerPage": 10
}
```

---

## Webhook Events

### Payment Webhook

**Endpoint:** `POST /api/payment/webhook`

**Description:** Razorpay webhook for payment notifications

**Headers:**
- `X-Razorpay-Signature` - Webhook signature

**Event Types:**
- `payment.authorized`
- `payment.captured`
- `payment.failed`

---

## Examples with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "admin123"
  }' \
  -c cookies.txt
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/user/me \
  -b cookies.txt
```

### Create Order
```bash
curl -X POST http://localhost:8000/api/order \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "customer": {
      "name": "John Doe",
      "phone": 9876543210
    },
    "items": [
      {
        "name": "Butter Chicken",
        "price": 400,
        "quantity": 2
      }
    ],
    "tableId": "507f1f77bcf86cd799439012"
  }'
```

---

## Postman Collection

Import this collection URL:
```
https://api.postman.com/collections/...
```

Or use the Postman collection file in:
```
/docs/postman_collection.json
```

---

## Testing

### Unit Tests
```bash
cd pos-backend
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Load Testing
```bash
npm run test:load
```

---

## Changelog

### Version 1.0.0 (February 18, 2026)
- Initial API release
- User authentication
- Order management
- Table management
- Payment integration

---

## Support

For API support:
- Email: api-support@restaurant.com
- GitHub Issues: [Link to issues]
- Documentation: [Link to docs]

---

**Last Updated:** February 18, 2026

**API Version:** 1.0.0

---

**Happy Coding! 🚀**
