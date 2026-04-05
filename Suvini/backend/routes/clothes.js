const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Cloth = require("../models/Cloth");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const router = express.Router();

const toValidOfferPrice = (offerPrice, referencePrice) => {
  const parsed = Number(offerPrice);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  if (Number.isFinite(referencePrice) && parsed >= referencePrice) {
    return undefined;
  }

  return parsed;
};

const normalizeColorOptions = (colorValue) => {
  if (Array.isArray(colorValue)) {
    return Array.from(
      new Set(
        colorValue.map((color) => String(color || "").trim()).filter(Boolean),
      ),
    );
  }

  const raw = String(colorValue || "").trim();
  if (!raw) {
    return [];
  }

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean),
    ),
  );
};

const toClientCloth = (clothDoc) => {
  const cloth = clothDoc.toObject();
  return {
    ...cloth,
    color: normalizeColorOptions(cloth.color),
    id: cloth._id,
  };
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// GET all clothes (for client)
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

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
    if (mongoose.connection.readyState !== 1) {
      return res.status(404).json({ message: "Cloth not found" });
    }

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
    const {
      name,
      description,
      price,
      offerPrice,
      size,
      color,
      category,
      stock,
    } = req.body;

    if (!name || !price || !req.file) {
      return res
        .status(400)
        .json({ message: "Name, price, and image are required" });
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Price must be a valid number" });
    }

    const parsedOfferPrice = toValidOfferPrice(offerPrice, parsedPrice);

    const uploadedImage = await uploadBufferToCloudinary(req.file.buffer, {
      mimeType: req.file.mimetype,
      folder: "suvini/products",
      publicId: `cloth-${Date.now()}-${uuidv4()}`,
    });

    const clothId = uuidv4();
    const newCloth = new Cloth({
      _id: clothId,
      name,
      description: description || "",
      price: parsedPrice,
      offerPrice: parsedOfferPrice,
      size: size || "All Sizes",
      color: normalizeColorOptions(color),
      category: category || "Cotton",
      stock: stock || "In Stock",
      image: uploadedImage.secureUrl,
      imagePublicId: uploadedImage.publicId,
    });

    await newCloth.save();

    res.status(201).json({
      message: "Cloth added successfully",
      cloth: toClientCloth(newCloth),
    });
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

    const {
      name,
      description,
      price,
      offerPrice,
      size,
      color,
      category,
      stock,
    } = req.body;

    let targetPrice = Number(cloth.price || 0);

    if (name) cloth.name = name;
    if (description) cloth.description = description;
    if (price !== undefined && String(price).trim() !== "") {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a valid number" });
      }

      cloth.price = parsedPrice;
      targetPrice = parsedPrice;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "offerPrice")) {
      const parsedOfferPrice = toValidOfferPrice(offerPrice, targetPrice);
      cloth.offerPrice = parsedOfferPrice;
    } else if (cloth.offerPrice && cloth.offerPrice >= targetPrice) {
      cloth.offerPrice = undefined;
    }

    if (size) cloth.size = size;
    if (Object.prototype.hasOwnProperty.call(req.body, "color")) {
      cloth.color = normalizeColorOptions(color);
    }
    if (category) cloth.category = category;
    if (stock) cloth.stock = stock;
    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(req.file.buffer, {
        mimeType: req.file.mimetype,
        folder: "suvini/products",
        publicId: `cloth-${Date.now()}-${uuidv4()}`,
      });

      if (cloth.imagePublicId) {
        await deleteFromCloudinary(cloth.imagePublicId);
      }

      cloth.image = uploadedImage.secureUrl;
      cloth.imagePublicId = uploadedImage.publicId;
    }

    await cloth.save();

    res.json({
      message: "Cloth updated successfully",
      cloth: toClientCloth(cloth),
    });
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

    if (cloth.imagePublicId) {
      await deleteFromCloudinary(cloth.imagePublicId);
    }

    res.json({
      message: "Cloth deleted successfully",
      cloth: toClientCloth(cloth),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting cloth", error: err.message });
  }
});

module.exports = router;
