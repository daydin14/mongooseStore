const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));

const mongoose = require("mongoose");
const Product = require("./models/product");
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongo not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// Create
app.post("/products", (req, res) => {
  Product.create(req.body),
    (error, createdProduct) => {
      res.redirect("/products");
    };
});

// Index
app.get("/products", (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render("index.ejs", { product: allProducts });
  });
});
app.listen(PORT);
