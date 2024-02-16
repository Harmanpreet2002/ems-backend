const express = require("express");
const { attendanceController } = require("../../../controllers/v1");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post("/punch", auth('attendanceMaker'), attendanceController.createAttendance);
router.get("/record", auth('getAttendance'), attendanceController.getAttendance);
router.get("/working-hours-per-day", auth('getAttendance'), attendanceController.getWorkingHoursByDay);
router.get("/working-hours-per-month", auth('getAttendance'), attendanceController.getWorkingHoursByMonth)

module.exports = router;
