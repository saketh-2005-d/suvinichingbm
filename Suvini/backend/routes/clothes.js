const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

const clothesFile = path.join(__dirname, "../data/clothes.json");

// Helper function to read clothes
const readClothes = () => {
  try {
    const data = fs.readFileSync(clothesFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading clothes file:", err);
    return [];
  }
};

// Helper function to write clothes
const writeClothes = (clothes) => {
  try {
    fs.writeFileSync(clothesFile, JSON.stringify(clothes, null, 2));
  } catch (err) {
    console.error("Error writing clothes file:", err);
  }
};

// GET all clothes (for client)
router.get("/", (req, res) => {
  try {
    const clothes = readClothes();
    res.json(clothes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching clothes", error: err.message });
  }
});

// GET single cloth by ID
router.get("/:id", (req, res) => {
  try {
    const clothes = readClothes();
    const cloth = clothes.find((c) => c.id === req.params.id);
    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }
    res.json(cloth);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cloth", error: err.message });
  }
});

// POST add new cloth (for admin)
router.post("/", upload.single("image"), (req, res) => {
  try {
    const { name, description, price, size, color, category, stock } = req.body;

    if (!name || !price || !req.file) {
      return res
        .status(400)
        .json({ message: "Name, price, and image are required" });
    }

    const clothes = readClothes();
    const newCloth = {
      id: uuidv4(),
      name,
      description: description || "",
      price: parseFloat(price),
      size: size || "All Sizes",
      color: color || "",
      category: category || "Cotton",
      stock: stock || "In Stock",
      image: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clothes.push(newCloth);
    writeClothes(clothes);

    res
      .status(201)
      .json({ message: "Cloth added successfully", cloth: newCloth });
  } catch (err) {
    res.status(500).json({ message: "Error adding cloth", error: err.message });
  }
});

// PUT update cloth (for admin)
router.put("/:id", upload.single("image"), (req, res) => {
  try {
    const clothes = readClothes();
    const clothIndex = clothes.findIndex((c) => c.id === req.params.id);

    if (clothIndex === -1) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const { name, description, price, size, color, category, stock } = req.body;
    const cloth = clothes[clothIndex];

    if (name) cloth.name = name;
    if (description) cloth.description = description;
    if (price) cloth.price = parseFloat(price);
    if (size) cloth.size = size;
    if (color) cloth.color = color;
    if (category) cloth.category = category;
    if (stock) cloth.stock = stock;
    if (req.file) cloth.image = `/uploads/${req.file.filename}`;

    cloth.updatedAt = new Date().toISOString();

    clothes[clothIndex] = cloth;
    writeClothes(clothes);

    res.json({ message: "Cloth updated successfully", cloth });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cloth", error: err.message });
  }
});

// DELETE cloth (for admin)
router.delete("/:id", (req, res) => {
  try {
    const clothes = readClothes();
    const clothIndex = clothes.findIndex((c) => c.id === req.params.id);

    if (clothIndex === -1) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const deletedCloth = clothes.splice(clothIndex, 1);
    writeClothes(clothes);

    res.json({ message: "Cloth deleted successfully", cloth: deletedCloth[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting cloth", error: err.message });
  }
});

module.exports = router;
