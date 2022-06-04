const express = require("express");
const ProSchema = require("../models/product.model");
const router = express.Router();
const multer = require("multer");

var randomString = require("random-string");

const path = "./assets/images/products";
// file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const fName = file.originalname;

    const fArr = fName.split(".");
    const ext = fArr[fArr.length - 1];

    const extArr = ["png", "jpg", "jpeg"];

    if (extArr.includes(ext)) {
      var name = randomString({
        length: 20,
        numeric: true,
        letters: true,
        special: false,
        exclude: ["a", "b", "1"],
      });

      cb(null, `${name}.${ext}`);
    } else {
      console.log("Please Choose Valid File");
    }
  },
});

const upload = multer({ storage }).single("picture");

// file upload ends

// router.get("/", (req, res) => {
//   res.status(200).json({ status: 200, msg: "Cat Routes Is Working" });
// });

// add product
router.post("/add", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    const { name, description, price, category, discount, added_by } = req.body;
    var picture = req.file.filename;

    let insPro = new ProSchema({
      name,
      description,
      addedBy: added_by,
      picture,
      discount,
      category,
      price,
    });

    insPro
      .save()
      .then((result) => {
        if (!result)
          return res.status(500).json({ status: 500, msg: "Something Wrong" });
        res.status(200).json({ msg: "Success", status: 200 });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, msg: err.message });
      });
  });
});

// fetch products
router.get("/", (req, res) => {
  ProSchema.find({}, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});

// fetch single product
router.get("/:_id", (req, res) => {
  const {_id}=req.params
  CatSchema.findOne({ _id }, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});

module.exports = router;
