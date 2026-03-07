const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected");

    // Load models so associations are registered before sync
    require("../models/userModel");
    require("../models/tableModel");
    require("../models/orderModel");
    require("../models/paymentModel");

    await sequelize.sync();
    console.log("✅ PostgreSQL schema synced");
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };