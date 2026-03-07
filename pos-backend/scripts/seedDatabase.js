const { sequelize } = require("../config/database");
const User = require("../models/userModel");
const Table = require("../models/tableModel");

const seedUsers = async () => {
  const existingUsers = await User.count();
  if (existingUsers > 0) {
    console.log("✅ Users already exist, skipping user seeding");
    return;
  }

  const users = [
    {
      name: "Admin User",
      email: "admin@restaurant.com",
      phone: "9876543210",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Manager User",
      email: "manager@restaurant.com",
      phone: "9876543211",
      password: "manager123",
      role: "manager",
    },
    {
      name: "Waiter John",
      email: "waiter@restaurant.com",
      phone: "9876543212",
      password: "waiter123",
      role: "waiter",
    },
    {
      name: "Chef Ramesh",
      email: "chef@restaurant.com",
      phone: "9876543213",
      password: "chef123",
      role: "chef",
    },
    {
      name: "Cashier Mary",
      email: "cashier@restaurant.com",
      phone: "9876543214",
      password: "cashier123",
      role: "cashier",
    },
  ];

  await User.bulkCreate(users);
  console.log("✅ Users seeded successfully!");
};

const seedTables = async () => {
  const existingTables = await Table.count();
  if (existingTables > 0) {
    console.log("✅ Tables already exist, skipping table seeding");
    return;
  }

  const tables = [];
  for (let i = 1; i <= 20; i++) {
    tables.push({
      tableNo: i,
      seats: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
      status: "Available",
    });
  }

  await Table.bulkCreate(tables);
  console.log("✅ Tables seeded successfully!");
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");
    await sequelize.sync();

    await seedUsers();
    await seedTables();

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
