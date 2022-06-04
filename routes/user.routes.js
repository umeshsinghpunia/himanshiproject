const express = require("express");
const UserSchema = require("../models/user.model");
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");

var randomString = require("random-string");

const path = "./assets/images/users";
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

router.get("/", (req, res) => {
  res.status(200).json({ status: 200, msg: "Routes Is Working" });
});

// add user
router.post("/add", (req, res) => {
  // console.log(req.body.name);
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    const { email, password, name, added_by } = req.body;
    var picture = req.file.filename;

    bcrypt.hash(password, 12, (err, pass) => {
      if (err) return res.status(500).json({ status: 500, msg: err.message });
      let insUser = new UserSchema({
        email,
        password: pass,
        name,
        addedBy: added_by,
        picture,
      });

      insUser
        .save()
        .then((result) => {
          if (!result)
            return res
              .status(500)
              .json({ status: 500, msg: "Something Wrong!" });
          res.status(200).json({ status: 200, msg: "User Added Successfully" });
        })
        .catch((err) => {
          res.status(500).json({ status: 500, msg: err.message });
        });
    });
  });
});

// login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ status: 400, msg: "Please Fill Fields" });

  UserSchema.findOne({ email, status: "active" }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });

    if (data) {
      bcrypt.compare(password, data.password, (err, valid) => {
        if (err)
          return res.status(500).json({ status: 500, msg: "Something Wrong" });
        if (!valid)
          return res.status(400).json({ status: 400, msg: "Wrong Info" });
        res.status(200).json({ status: 200, msg: "Login Success" });
      });
    } else {
      res.status(400).json({ status: 400, msg: "Please Fill Correct Info." });
    }
  });
});

// fetch profile
router.get("/profile/:email", (req, res) => {
  const { email } = req.params;

  UserSchema.findOne({ email }, (err, data) => {
    if (err)
      return res.status(500).json({ status: 500, msg: "Something Wrong" });
    res.status(200).json({ status: 200, msg: data });
  });
});

// change password
router.put("/password/:_id", (req, res) => {
  const { _id } = req.params;
  const { op, np } = req.body;

  // if not password
  if (!op || !np)
    return res.status(400).json({ status: 400, msg: "Please Enter Details" });

  UserSchema.findById({ _id }, (err, data) => {
    if (err)
      return res
        .status(400)
        .json({ status: 400, msg: "Please Forward Correct Details" });
    let dbPass = data.password;

    bcrypt.compare(op, dbPass, (err, result) => {
      if (err)
        return res.status(500).json({ status: 500, msg: "Something Wrong" });
      if (!result)
        return res.status(400).json({ status: 400, msg: "Wrong Info" });
      // correct password
      bcrypt.hash(np, 12, (err, hash) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message });
        if (!hash) {
          return res.status(500).json({ status: 500, msg: "Something Wrong" });
        }

        UserSchema.findByIdAndUpdate({ _id }, { password: hash }, (err, d) => {
          if (err)
            return res.status(500).json({ status: 500, msg: err.message });
          if (!d) {
            return res
              .status(500)
              .json({ status: 500, msg: "Something Wrong" });
          }

          res
            .status(200)
            .json({ status: 200, msg: "Password Change Successfully" });
        });
      });
    });
  });
});

module.exports = router;
