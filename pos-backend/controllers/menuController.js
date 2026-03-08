const createHttpError = require("http-errors");
const Category = require("../models/categoryModel");
const MenuItem = require("../models/menuItemModel");
const path = require("path");
const fs = require("fs");

// ─── Categories ──────────────────────────────────────────

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    res.status(200).json({ data: { categories } });
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    if (!name) return next(createHttpError(400, "Category name is required"));

    const category = await Category.create({ name, image: image || null });
    res.status(201).json({ success: true, message: "Category created!", data: category });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next(createHttpError(409, "Category already exists"));
    }
    next(error);
  }
};

// ─── Menu Items ──────────────────────────────────────────

const getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.findAll({
      include: Category,
      order: [["name", "ASC"]],
    });
    res.status(200).json({ data: { menuItems } });
  } catch (error) {
    next(error);
  }
};

const addMenuItem = async (req, res, next) => {
  try {
    const { name, price, categoryId, isVeg } = req.body;

    if (!name || !price || !categoryId) {
      return next(createHttpError(400, "Name, price, and categoryId are required"));
    }

    // Validate price
    const trimmedPrice = typeof price === "string" ? price.trim() : String(price);
    const validatedPrice = parseFloat(trimmedPrice);
    if (!Number.isFinite(validatedPrice) || validatedPrice <= 0) {
      return next(createHttpError(400, "Price must be a positive number"));
    }

    // Validate isVeg – only explicit true/"true" is truthy; everything else is false
    let validatedIsVeg = false;
    if (typeof isVeg === "boolean") {
      validatedIsVeg = isVeg;
    } else if (typeof isVeg === "string") {
      validatedIsVeg = isVeg.toLowerCase() === "true";
    }

    const category = await Category.findByPk(categoryId);
    if (!category) return next(createHttpError(404, "Category not found"));

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const menuItem = await MenuItem.create({
      name,
      price: validatedPrice,
      categoryId: parseInt(categoryId),
      isVeg: validatedIsVeg,
      image: imagePath,
    });

    res.status(201).json({ success: true, message: "Menu item created!", data: menuItem });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, addCategory, getMenuItems, addMenuItem };
