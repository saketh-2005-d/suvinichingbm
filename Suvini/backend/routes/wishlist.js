const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const wishlistFile = path.join(__dirname, "../data/wishlist.json");
const clothesFile = path.join(__dirname, "../data/clothes.json");

// Helper functions
const readWishlist = () => {
  try {
    const data = fs.readFileSync(wishlistFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeWishlist = (wishlist) => {
  fs.writeFileSync(wishlistFile, JSON.stringify(wishlist, null, 2));
};

const readClothes = () => {
  try {
    const data = fs.readFileSync(clothesFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// GET all wishlist items
router.get("/", (req, res) => {
  try {
    const wishlist = readWishlist();
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: err.message });
  }
});

// GET wishlist items with full cloth details
router.get("/details/all", (req, res) => {
  try {
    const wishlist = readWishlist();
    const clothes = readClothes();

    const wishlistWithDetails = wishlist.map((item) => {
      const cloth = clothes.find((c) => c.id === item.clothId);
      return { ...item, clothDetails: cloth };
    });

    res.json(wishlistWithDetails);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist details", error: err.message });
  }
});

// POST add to wishlist
router.post("/", (req, res) => {
  try {
    const { clothId } = req.body;

    if (!clothId) {
      return res.status(400).json({ message: "Cloth ID is required" });
    }

    const clothes = readClothes();
    const cloth = clothes.find((c) => c.id === clothId);

    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const wishlist = readWishlist();

    // Check if already in wishlist
    if (wishlist.some((item) => item.clothId === clothId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = {
      id: uuidv4(),
      clothId,
      addedAt: new Date().toISOString(),
    };

    wishlist.push(wishlistItem);
    writeWishlist(wishlist);

    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: err.message });
  }
});

// DELETE from wishlist
router.delete("/:id", (req, res) => {
  try {
    const wishlist = readWishlist();
    const itemIndex = wishlist.findIndex((item) => item.id === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    const deletedItem = wishlist.splice(itemIndex, 1);
    writeWishlist(wishlist);

    res.json({ message: "Removed from wishlist", item: deletedItem[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err.message });
  }
});

// DELETE from wishlist by clothId
router.delete("/cloth/:clothId", (req, res) => {
  try {
    const wishlist = readWishlist();
    const itemIndex = wishlist.findIndex(
      (item) => item.clothId === req.params.clothId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cloth not found in wishlist" });
    }

    const deletedItem = wishlist.splice(itemIndex, 1);
    writeWishlist(wishlist);

    res.json({ message: "Removed from wishlist", item: deletedItem[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err.message });
  }
});

module.exports = router;
