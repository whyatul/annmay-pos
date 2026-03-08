const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Ingredient = sequelize.define(
  "Ingredient",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    unit: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  { timestamps: true }
);

module.exports = Ingredient;
