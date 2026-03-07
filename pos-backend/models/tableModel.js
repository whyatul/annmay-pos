const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Table = sequelize.define(
  "Table",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tableNo: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Available",
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Table;