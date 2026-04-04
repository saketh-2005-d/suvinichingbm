const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Wishlist = require("../models/Wishlist");
const Cloth = require("../models/Cloth");

const router = express.Router();

// GET all wishlist items
router.get("/", async (req, res) => {
  try {
    const wishlist = await Wishlist.find({});
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: err.message });
  }
});

// GET wishlist items with full cloth details
router.get("/details/all", async (req, res) => {
  try {
    const wishlist = await Wishlist.find({});

    const wishlistWithDetails = await Promise.all(
      wishlist.map(async (item) => {
        const cloth = await Cloth.findById(item.clothId);
        return { ...item.toObject(), clothDetails: cloth };
      })
    );

    res.json(wishlistWithDetails);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist details", error: err.message });
  }
});

// POST add to wishlist
router.post("/", async (req, res) => {
  try {
    const { clothId } = req.body;

    if (!clothId) {
      return res.status(400).json({ message: "Cloth ID is required" });
    }

    const cloth = await Cloth.findById(clothId);

    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ clothId });
    if (existing) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = new Wishlist({
      clothId,
      name: cloth.name,
      price: cloth.price,
      image: cloth.image,
    });

    await wishlistItem.save();

    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: err.message });
  }
});

// DELETE from wishlist
router.delete("/:id", async (req, res) => {
  try {
    const item = await Wishlist.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.json({ message: "Removed from wishlist", item });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err.message });
  }
});

// DELETE from wishlist by clothId
router.delete("/cloth/:clothId", async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      clothId: req.params.clothId,
    });

    if (!item) {
      return res.status(404).json({ message: "Cloth not found in wishlist" });
    }

    res.json({ message: "Removed from wishlist", item });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err.message });
  }
});

module.exports = router;
