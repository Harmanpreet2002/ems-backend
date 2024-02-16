const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
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
    punchInTimes: {
        type: [Date],
        default: []
    },
    punchOutTimes: {
        type: [Date],
        default: []
    }
})

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;