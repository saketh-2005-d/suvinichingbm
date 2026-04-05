const mongoose = require("mongoose");

const clothSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: Number,
    category: String,
    color: {
      type: [String],
      default: [],
    },
    size: String,
    description: String,
    image: String,
    imagePublicId: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cloth", clothSchema);
