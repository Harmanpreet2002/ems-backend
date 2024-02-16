const mongoose = require("mongoose");

const workTimesSchema = mongoose.Schema({
  employeeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  workTimes: {
    type: Object,
    validate: {
      validator: function (value) {
        return (
          value === null || value === undefined || Object.keys(value).length > 0
        );
      },
      message: "workTimes must not be empty",
    },
  },
});

const WorkTimes = mongoose.model("WorkTimes", workTimesSchema);

module.exports = WorkTimes;
