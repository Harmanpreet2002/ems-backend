const mongoose = require("mongoose");

const standupSchema = mongoose.Schema({
  employeeId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  employee: {
    type: String,
    required: true,
    maxLength: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  question1: {
    type: String,
    required: true,
  },
  question2: {
    type: String,
    required: true,
  },
  question3: {
    type: String,
    required: true,
  },
});

const Standup = mongoose.model("Standup", standupSchema);

module.exports = Standup;
