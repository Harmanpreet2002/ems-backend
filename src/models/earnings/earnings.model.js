const mongoose = require("mongoose");
const toJSON = require("../plugins/toJSON.plugin");

const earningsSchema = new mongoose.Schema({
  employeeId: {
    type: String, 
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  earnings: {
    type: Number,
    required: true,
  },
});

earningsSchema.plugin(toJSON);

const Earnings = mongoose.model("Earnings", earningsSchema);

module.exports = Earnings;
