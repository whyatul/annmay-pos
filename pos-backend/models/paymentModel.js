const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Order = require("./orderModel");

const Payment = sequelize.define(
  "Payment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    paymentId: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
    method: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

Payment.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(Payment, { foreignKey: "orderId" });

module.exports = Payment;