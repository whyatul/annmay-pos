const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const { deductInventoryForOrder } = require("./inventoryController");

const addOrder = async (req, res, next) => {
  try {
    const {
      customerDetails,
      orderStatus,
      orderType,
      bills,
      items,
      table,
      paymentMethod,
      paymentData,
    } = req.body;

    if (!customerDetails || !bills || !items) {
      const error = createHttpError(400, "Missing order data");
      return next(error);
    }

    const newOrder = await Order.create({
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      guests: customerDetails.guests,
      orderType: orderType || "Dine In",
      orderStatus,
      total: bills.total,
      tax: bills.tax,
      totalWithTax: bills.totalWithTax,
      items,
      tableId: table || null,
      paymentMethod,
      razorpay_order_id: paymentData?.razorpay_order_id,
      razorpay_payment_id: paymentData?.razorpay_payment_id,
    });

    // Auto-deduct inventory based on recipes
    if (items && items.length > 0) {
      try {
        await deductInventoryForOrder(items, newOrder.id);
      } catch (err) {
        console.error("Inventory deduction failed:", err);
      }
    }

    req.io.emit("newOrder", newOrder);
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: newOrder });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, { include: Table });
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ include: Table });
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    order.orderStatus = orderStatus;
    await order.save();

    // If cancelled or completed and had a table, free it
    if ((orderStatus === "Cancelled" || orderStatus === "Completed") && order.tableId) {
      const table = await Table.findByPk(order.tableId);
      if (table && table.status === "Booked") {
        table.status = "Available";
        table.currentOrderId = null;
        await table.save();
      }
    }

    req.io.emit("orderUpdated", order);
    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder };
