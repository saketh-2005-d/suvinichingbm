const express = require("express");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Cloth = require("../models/Cloth");

const router = express.Router();

const toClientCloth = (clothDoc) => {
  const cloth = clothDoc.toObject();
  return { ...cloth, id: cloth._id };
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// GET all clothes (for client)
router.get("/", async (req, res) => {
  try {
    const clothes = await Cloth.find({});
    res.json(clothes.map(toClientCloth));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching clothes", error: err.message });
  }
});

// GET single cloth by ID
router.get("/:id", async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);
    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }
    res.json(toClientCloth(cloth));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cloth", error: err.message });
  }
});

// POST add new cloth (for admin)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, size, color, category, stock } = req.body;

    if (!name || !price || !req.file) {
      return res
        .status(400)
        .json({ message: "Name, price, and image are required" });
    }

    const clothId = uuidv4();
    const newCloth = new Cloth({
      _id: clothId,
      name,
      description: description || "",
      price: parseFloat(price),
      size: size || "All Sizes",
      color: color || "",
      category: category || "Cotton",
      stock: stock || "In Stock",
      image: `/uploads/${req.file.filename}`,
    });

    await newCloth.save();

    res
      .status(201)
      .json({ message: "Cloth added successfully", cloth: toClientCloth(newCloth) });
  } catch (err) {
    res.status(500).json({ message: "Error adding cloth", error: err.message });
  }
});

// PUT update cloth (for admin)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);

    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const { name, description, price, size, color, category, stock } = req.body;

    if (name) cloth.name = name;
    if (description) cloth.description = description;
    if (price) cloth.price = parseFloat(price);
    if (size) cloth.size = size;
    if (color) cloth.color = color;
    if (category) cloth.category = category;
    if (stock) cloth.stock = stock;
    if (req.file) cloth.image = `/uploads/${req.file.filename}`;

    await cloth.save();

    res.json({ message: "Cloth updated successfully", cloth: toClientCloth(cloth) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cloth", error: err.message });
  }
});

// DELETE cloth (for admin)
router.delete("/:id", async (req, res) => {
  try {
    const cloth = await Cloth.findByIdAndDelete(req.params.id);

    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    res.json({ message: "Cloth deleted successfully", cloth: toClientCloth(cloth) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting cloth", error: err.message });
  }
});

module.exports = router;
