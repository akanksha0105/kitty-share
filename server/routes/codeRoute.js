const express = require("express");

const router = express.Router();
const Code = require("../models/codeModel");
var mongoose = require("mongoose");

console.log("Hi");

// router.get("/getcodegenerated", (req, res) => {
//   Code.find({message: req.body.}, (err, docs) => {
//     if (!err) {
//     //   return res.send(docs);
//     console.log("response", res);
//     } else {
//       return res.status(400).json({ message: "Something went wrong" });
//     }
//   });
// });

router.post("/postthevalue", (req, res) => {
  const message = req.body.valueOfTheURL;
  var objectId = mongoose.Types.ObjectId();
  const code = objectId.str;

  //   console.log(newObjectId);
  const newCodePair = new Code({
    code: code,
    message: message,
  });

  newCodePair.save((err) => {
    if (err) {
      return res.status(400).json({ message: "Something went wrong" });
    } else {
      console.log("code", code);
      res.send(" Code Pair Generated Successfully");
    }
  });
});

module.exports = router;
