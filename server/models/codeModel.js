const mongoose = require("mongoose");

const codeSchema = mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
    unique: true,
  },
});

const Codes = mongoose.model("codes", codeSchema);

module.exports = Codes;
