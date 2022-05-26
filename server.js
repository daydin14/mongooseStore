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

// Seed
const productSeed = require("./models/seed");
app.get("/products/seed", (req, res) => {
  Product.create(productSeed),
    (error, createdProductSeed) => {
      res.redirect("/products");
    };
});
// Create
app.post("/products", (req, res) => {
  Product.create(req.body),
    (error, createdProduct) => {
      res.redirect("/products");
    };
});
// New
app.get("/products/new", (req, res) => {
  res.render("new.ejs");
});
// Index
app.get("/products", (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render("index.ejs", { product: allProducts });
  });
});
// Show
app.get("/products/:id", (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render("show.ejs", {
      product: foundProduct,
    });
  });
});
// Edit
app.get("/products/:id/edit", (req, res) => {
  Product.findById(req.params.id, (error, foundProduct) => {
    res.render("edit.ejs");
  });
});
// Update
app.put("/products/:id", (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
    (error, updatedProdcut) => {
      res.redirect(`/products/${req.params.id}`);
    }
  );
});
// Delete
app.delete("/products/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, data) => {
    res.redirect("/products");
  });
});
// Buying a product - Quantity remaining
app.post("/products/:id/buy", (req, res) => {
  Product.findById(req.params.id, (error, data) => {
    if (data.qty === 0) {
      data.qty = "OUT OF STOCK";
    } else {
      data.qty--;
      data.save();
    }
    res.redirect("/products/");
  });
});
app.listen(PORT);
