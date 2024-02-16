const express = require("express");
const { adminEmpController } = require("../../../controllers/v1");
const holidaysUpload = require("../../../middlewares/holidaysUpload");
const auth = require("../../../middlewares/auth");


const router = express.Router();

router.get("/get_employees", auth('getEmployees'), adminEmpController.getAllEmployees);
router.get("/get_employee/:employeeId", auth('getEmployee'), adminEmpController.getEmployeeById);
router.put("/update_employee/:employeeId", auth('manageEmployees'), adminEmpController.updateEmployeeById)
router.post("/employee/holidays", holidaysUpload.single("holidays"),  adminEmpController.handleHolidayUpload )
router.get("/all_holidays", adminEmpController.getAllHolidays);
router.put("/update_holiday/:id", adminEmpController.updateHolidayById);

module.exports = router;