const express = require("express");
const router = express.Router();
const DevicesModel = require("../models/devicesModel");
var mongoose = require("mongoose");

router.post("/", (req, res) => {
  const deviceId = req.body.deviceId;
  //   const deviceName = req.body.deviceName;

  const newDevicePair = new DevicesModel({
    device_id: deviceId,
    // deviceName: deviceName,
  });
  return newDevicePair.save().then((record) => {
    console.log("record is", record);
    return record;
  });
});

module.exports = router;
