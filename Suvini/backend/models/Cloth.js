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
    category: String,
    color: String,
    size: String,
    description: String,
    image: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cloth", clothSchema);
