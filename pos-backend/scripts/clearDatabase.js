require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { sequelize, connectDB } = require("../config/database");

const clearDatabase = async () => {
  try {
    console.log("🗑️  Starting database cleanup...");
    await connectDB();

    // Drop all tables and recreate
    await sequelize.drop();
    console.log("✅ All tables dropped");

    // Re-sync to recreate empty tables
    await sequelize.sync({ force: true });
    console.log("✅ Empty tables recreated");

    console.log("🎉 Database cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
