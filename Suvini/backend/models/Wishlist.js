const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    clothId: {
      type: String,
      required: true,
    },
    name: String,
    price: Number,
    image: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
