const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  getCategories,
  addCategory,
  getMenuItems,
  addMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Trusted MIME → extension mapping (never rely on user-supplied originalname)
const MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// Multer storage for menu-item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype];
    if (!ext) {
      return cb(new Error("Only JPEG, PNG and WebP images are allowed"));
    }
    const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG and WebP images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

// ─── Public (customer-facing) ────────────────────────────
router.get("/categories", getCategories);
router.get("/items", getMenuItems);

// ─── Protected (staff dashboard) ─────────────────────────
router.post("/categories", isVerifiedUser, addCategory);
router.post("/items", isVerifiedUser, upload.single("image"), addMenuItem);

// ─── Multer error-handling middleware ─────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ success: false, message: "File too large. Maximum size is 2 MB." });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }

  if (err && err.message && err.message.includes("Only JPEG, PNG and WebP")) {
    return res.status(415).json({ success: false, message: err.message });
  }

  next(err);
});

module.exports = router;
