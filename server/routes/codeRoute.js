const express = require("express");
const router = express.Router();
const CodeModel = require("../models/codeModel");
var mongoose = require("mongoose");
const ObjectId = require("mongo-objectid");

router.post("/getcodegenerated", (req, res) => {
  const code = req.body.codedMessage;
  CodeModel.find({ code: code }, (err, docs) => {
    if (docs.length > 0) {
      console.log(res);
      return res.status(200).json({ data: docs[0].message });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
});

router.post("/postthevalue", (req, res) => {
  const message = req.body.valueOfTheURL;
  CodeModel.find({ message: message }, (err, docs) => {
    if (docs.length > 0) {
      console.log("URL already exists");
    } else {
      const id = new ObjectId().toString();
      const code = id;

      const newCodePair = new CodeModel({
        code: code,
        message: message,
      });

      newCodePair.save((err) => {
        if (!err) {
          console.log("response of post request in node.js", code);
          return res.status(200).json({ data: code });
        } else {
          return res.status(400).json({ message: "Something went wrong" });
        }
      });
    }
  });
});

module.exports = router;
