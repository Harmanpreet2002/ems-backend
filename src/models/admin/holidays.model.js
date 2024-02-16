const mongoose = require("mongoose");

const holidaySchema = mongoose.Schema({
  holidayName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true
  }
});

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;