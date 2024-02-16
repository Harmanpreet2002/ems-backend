module.exports.adminController = require("./admin/auth.controller");
module.exports.adminEmpController = require("./admin/employee.controller");

module.exports.employeeController = require("./employee/auth.controller");
module.exports.profileController = require("./employee/profile.controller");

module.exports.attendanceController = require("./attendance/attendance.controller");
module.exports.standupController = require("./attendance/standup.controller");

module.exports.earningController = require("./earnings/earning.controller");
