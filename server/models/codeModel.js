const mongoose = require("mongoose");

const codeSchema = mongoose.Schema({
  code: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const Codes = mongoose.model("codes", codeSchema);

module.exports = Codes;
