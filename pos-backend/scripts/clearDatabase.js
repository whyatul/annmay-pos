const { sequelize } = require("../config/database");
const User = require("../models/userModel");
const Table = require("../models/tableModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");

const clearDatabase = async () => {
  try {
    console.log("🗑️  Starting database cleanup...");

    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    await Payment.destroy({ where: {} });
    console.log("✅ Payments table cleared");

    await Order.destroy({ where: {} });
    console.log("✅ Orders table cleared");

    await Table.destroy({ where: {} });
    console.log("✅ Tables table cleared");

    await User.destroy({ where: {} });
    console.log("✅ Users table cleared");

    console.log("🎉 Database cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
