const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { attendanceService } = require("../../../services");

const createAttendance = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const { action } = req.body;
  const attendance = await attendanceService.createAttendance(
    employeeId,
    action
  );
  res.status(httpStatus.CREATED).send({ attendance });
});

const getAttendance = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const { attendanceRecords, totalCount } =
    await attendanceService.getEmployeeAttendance(employeeId);
  res.status(httpStatus.OK).send({ attendanceRecords, totalCount });
});

const getWorkingHoursByDay = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const results = await attendanceService.getWorkingHoursByDay(employeeId);
  res.status(httpStatus.OK).json(results);
});

const getWorkingHoursByMonth = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const monthlyResults = await attendanceService.getWorkingHoursByMonth(employeeId);
  res.status(httpStatus.OK).json(monthlyResults);
});

module.exports = {
  createAttendance,
  getAttendance,
  getWorkingHoursByDay,
  getWorkingHoursByMonth
};
