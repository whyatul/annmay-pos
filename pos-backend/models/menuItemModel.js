const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Category = require("./categoryModel");

const MenuItem = sequelize.define(
  "MenuItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    isVeg: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { timestamps: true }
);

MenuItem.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false } });
Category.hasMany(MenuItem, { foreignKey: "categoryId" });

module.exports = MenuItem;
