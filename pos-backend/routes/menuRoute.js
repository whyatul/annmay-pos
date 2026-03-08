const express = require("express");
const multer = require("multer");
const path = require("path");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  getCategories,
  addCategory,
  getMenuItems,
  addMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// Multer storage for menu-item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ─── Public (customer-facing) ────────────────────────────
router.get("/categories", getCategories);
router.get("/items", getMenuItems);

// ─── Protected (staff dashboard) ─────────────────────────
router.post("/categories", isVerifiedUser, addCategory);
router.post("/items", isVerifiedUser, upload.single("image"), addMenuItem);

module.exports = router;
