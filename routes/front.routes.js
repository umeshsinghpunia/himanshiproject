const express = require("express");
const CatSchema = require("../models/category.model");
const ProSchema = require("../models/product.model");
const router = express.Router();

// fetch categories
router.get("/category", (req, res) => {
  CatSchema.find({}, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});

// fetch single cat
router.get("/category/:_id", (req, res) => {
  const { _id } = req.params;

  CatSchema.findOne({ _id }, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});

// fetch all product by catname
router.get("/products/:catname", (req, res) => {
  const { catname } = req.params;

  ProSchema.find({ category: catname }, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});


// fetch single product
router.get("/product/:_id", (req, res) => {
  const { _id } = req.params;

  ProSchema.findOne({ _id }, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});
module.exports = router;
