const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const MenuItem = require("./menuItemModel");
const Ingredient = require("./ingredientModel");

const Recipe = sequelize.define(
  "Recipe",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
  },
  { timestamps: true }
);

MenuItem.belongsToMany(Ingredient, { through: Recipe, foreignKey: "menuItemId" });
Ingredient.belongsToMany(MenuItem, { through: Recipe, foreignKey: "ingredientId" });

module.exports = Recipe;
