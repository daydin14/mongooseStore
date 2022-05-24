const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  img: { type: String },
  price: { type: Number },
  qty: { type: Number },
});

const Product = mongoose.model("Product", productSchema);
module.export = Product;
