const express = require("express");
const router = express.Router();
const CodeModel = require("../models/codeModel");
var mongoose = require("mongoose");
const ObjectId = require("mongo-objectid");

router.post("/getcodegenerated", async (req, res) => {
  const code = req.body.codedMessage;
  console.log("Server fetching the code...");
  let codeGeneratedPromise = CodeModel.find({ code: code }).exec();

  codeGeneratedPromise
    .then((response) => {
      res.status(200).json({ data: response[0].message });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send("Server was unable to fetch the URL");
    });
});

router.post("/postthevalue", (req, res) => {
  const message = req.body.valueOfTheURL;
  console.log("Server checks if the URL is already present in the database");
  let messagePostedPromise = CodeModel.find({ message: message }).exec();
  messagePostedPromise
    .then((response) => {
      if (response.length > 0) {
        console.log("URL already exists");
      } else {
        console.log(
          "URL does not exist in the database. Server saving the URL..."
        );
        const id = new ObjectId().toString();
        const code = id;
        const newCodePair = new CodeModel({
          code: code,
          message: message,
          createdAt: new Date(),
        });
        return newCodePair.save();
      }
    })
    .then((result) => {
      console.log("URL saved by the server");
      console.log("Server generating the secret key for the entered URL...");
      // console.log(result);
      res.status(200).json({ data: result.code });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send("Server was not able to generate the secret key");
    });
});

module.exports = router;

// const { response } = require("express");

// router.post("/getcodegenerated", async (req, res) => {
//   const code = req.body.codedMessage;
//   CodeModel.find({ code: code }, (err, docs) => {
//     if (docs.length > 0) {
//       console.log(res);
//       return res.status(200).json({ data: docs[0].message });
//     } else {
//       return res.status(400).json({ message: "Something went wrong" });
//     }
//   });
// });
// router.post("/postthevalue", (req, res) => {
//   const message = req.body.valueOfTheURL;
//   CodeModel.find({ message: message }, (err, docs) => {
//     if (docs.length > 0) {
//       console.log("URL already exists");
//     } else {
//       const id = new ObjectId().toString();
//       const code = id;

//       const newCodePair = new CodeModel({
//         code: code,
//         message: message,
//       });

//       newCodePair.save((err) => {
//         if (!err) {
//           console.log("response of post request in node.js", code);
//           return res.status(200).json({ data: code });
//         } else {
//           return res.status(400).json({ message: "Something went wrong" });
//         }
//       });
//     }
//   });
// });
