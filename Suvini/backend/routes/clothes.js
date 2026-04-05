const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");
const Cloth = require("../models/Cloth");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const router = express.Router();
const CLOTHES_DATA_FILE = path.join(__dirname, "..", "data", "clothes.json");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
let inMemoryClothes = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

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

const readLocalClothes = async () => {
  if (inMemoryClothes.length > 0) {
    return [...inMemoryClothes];
  }

  try {
    const raw = await fs.readFile(CLOTHES_DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const clothes = Array.isArray(parsed) ? parsed : [];
    inMemoryClothes = [...clothes];
    return clothes;
  } catch (err) {
    if (err.code === "ENOENT") {
      return [...inMemoryClothes];
    }

    throw err;
  }
};

const writeLocalClothes = async (clothes) => {
  inMemoryClothes = [...clothes];

  try {
    await fs.mkdir(path.dirname(CLOTHES_DATA_FILE), { recursive: true });
    await fs.writeFile(CLOTHES_DATA_FILE, JSON.stringify(clothes, null, 2));
  } catch (err) {
    if (err.code === "EROFS" || err.code === "EACCES") {
      return;
    }

    throw err;
  }
};

const saveLocalImage = async (file) => {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const safeOriginalName = String(file.originalname || "image.jpg")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(-120);
    const fileName = `${Date.now()}-${uuidv4()}-${safeOriginalName}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    await fs.writeFile(filePath, file.buffer);
    return { secureUrl: `/uploads/${fileName}`, publicId: "" };
  } catch (err) {
    if (err.code === "EROFS" || err.code === "EACCES") {
      const mimeType = file.mimetype || "image/jpeg";
      return {
        secureUrl: `data:${mimeType};base64,${file.buffer.toString("base64")}`,
        publicId: "",
      };
    }

    throw err;
  }
};

const uploadImage = async (file) => {
  try {
    return await uploadBufferToCloudinary(file.buffer, {
      mimeType: file.mimetype,
      folder: "suvini/products",
      publicId: `cloth-${Date.now()}-${uuidv4()}`,
    });
  } catch {
    return saveLocalImage(file);
  }
};

const deleteLocalImage = async (imagePath) => {
  if (!imagePath || !String(imagePath).startsWith("/uploads/")) {
    return;
  }

  try {
    const fileName = path.basename(imagePath);
    await fs.unlink(path.join(UPLOADS_DIR, fileName));
  } catch {
    // Ignore missing local files.
  }
};

const toClientCloth = (clothDoc) => {
  const cloth =
    clothDoc && typeof clothDoc.toObject === "function"
      ? clothDoc.toObject()
      : { ...clothDoc };
  const id = cloth.id || cloth._id;
  return {
    ...cloth,
    id,
    _id: cloth._id || id,
    color: normalizeColorOptions(cloth.color),
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
    if (!isDbConnected()) {
      const localClothes = await readLocalClothes();
      return res.json(localClothes.map(toClientCloth));
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
    if (!isDbConnected()) {
      const localClothes = await readLocalClothes();
      const cloth = localClothes.find(
        (item) => String(item.id || item._id) === String(req.params.id),
      );
      if (!cloth) {
        return res.status(404).json({ message: "Cloth not found" });
      }

      return res.json(toClientCloth(cloth));
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

    const uploadedImage = await uploadImage(req.file);

    const clothId = uuidv4();
    const basePayload = {
      _id: clothId,
      id: clothId,
      name,
      description: description || "",
      price: parsedPrice,
      offerPrice: parsedOfferPrice,
      size: size || "All Sizes",
      color: normalizeColorOptions(color),
      category: category || "Cotton",
      stock: stock || "In Stock",
      image: uploadedImage.secureUrl,
      imagePublicId: uploadedImage.publicId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      const newCloth = new Cloth(basePayload);
      await newCloth.save();

      return res.status(201).json({
        message: "Cloth added successfully",
        cloth: toClientCloth(newCloth),
      });
    }

    const localClothes = await readLocalClothes();
    localClothes.push(basePayload);
    await writeLocalClothes(localClothes);

    res.status(201).json({
      message: "Cloth added successfully",
      cloth: toClientCloth(basePayload),
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding cloth", error: err.message });
  }
});

// PUT update cloth (for admin)
router.put("/:id", upload.single("image"), async (req, res) => {
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

    if (isDbConnected()) {
      const cloth = await Cloth.findById(req.params.id);

      if (!cloth) {
        return res.status(404).json({ message: "Cloth not found" });
      }

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
        const uploadedImage = await uploadImage(req.file);

        if (cloth.imagePublicId) {
          await deleteFromCloudinary(cloth.imagePublicId);
        }
        await deleteLocalImage(cloth.image);

        cloth.image = uploadedImage.secureUrl;
        cloth.imagePublicId = uploadedImage.publicId || undefined;
      }

      await cloth.save();

      return res.json({
        message: "Cloth updated successfully",
        cloth: toClientCloth(cloth),
      });
    }

    const localClothes = await readLocalClothes();
    const index = localClothes.findIndex(
      (item) => String(item.id || item._id) === String(req.params.id),
    );

    if (index === -1) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const cloth = { ...localClothes[index] };
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
      delete cloth.offerPrice;
    }

    if (size) cloth.size = size;
    if (Object.prototype.hasOwnProperty.call(req.body, "color")) {
      cloth.color = normalizeColorOptions(color);
    }
    if (category) cloth.category = category;
    if (stock) cloth.stock = stock;
    if (req.file) {
      const uploadedImage = await uploadImage(req.file);

      if (cloth.imagePublicId) {
        await deleteFromCloudinary(cloth.imagePublicId);
      }
      await deleteLocalImage(cloth.image);

      cloth.image = uploadedImage.secureUrl;
      cloth.imagePublicId = uploadedImage.publicId || undefined;
    }

    cloth.updatedAt = new Date().toISOString();
    localClothes[index] = cloth;
    await writeLocalClothes(localClothes);

    res.json({
      message: "Cloth updated successfully",
      cloth: toClientCloth(localClothes[index]),
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
    if (isDbConnected()) {
      const cloth = await Cloth.findByIdAndDelete(req.params.id);

      if (!cloth) {
        return res.status(404).json({ message: "Cloth not found" });
      }

      if (cloth.imagePublicId) {
        await deleteFromCloudinary(cloth.imagePublicId);
      }
      await deleteLocalImage(cloth.image);

      return res.json({
        message: "Cloth deleted successfully",
        cloth: toClientCloth(cloth),
      });
    }

    const localClothes = await readLocalClothes();
    const index = localClothes.findIndex(
      (item) => String(item.id || item._id) === String(req.params.id),
    );

    if (index === -1) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const [cloth] = localClothes.splice(index, 1);
    await deleteFromCloudinary(cloth.imagePublicId);
    await deleteLocalImage(cloth.image);
    await writeLocalClothes(localClothes);

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
