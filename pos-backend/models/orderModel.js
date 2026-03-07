const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Table = require("./tableModel");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
    guests: { type: DataTypes.INTEGER, allowNull: false },

    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    total: { type: DataTypes.FLOAT, allowNull: false },
    tax: { type: DataTypes.FLOAT, allowNull: false },
    totalWithTax: { type: DataTypes.FLOAT, allowNull: false },

    items: { type: DataTypes.JSONB, allowNull: false },

    paymentMethod: DataTypes.STRING,
    razorpay_order_id: DataTypes.STRING,
    razorpay_payment_id: DataTypes.STRING,
  },
  { timestamps: true }
);

Order.belongsTo(Table, { foreignKey: "tableId" });
Table.hasMany(Order, { foreignKey: "tableId" });

module.exports = Order;