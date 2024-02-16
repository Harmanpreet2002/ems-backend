const httpStatus = require("http-status");
const { attendanceService } = require("../../../services");
const catchAsync = require("../../../utils/catchAsync");

const createStandup = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const standupBody = {
    employeeId,
    ...req.body,
  };
  const standup = await attendanceService.createStandup(standupBody);
  res.status(httpStatus.CREATED).send(standup);
});

const getStandup = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const standup = await attendanceService.getStandup(employeeId);
  res.status(httpStatus.OK).send(standup);
});

module.exports = {
  createStandup,
  getStandup
};
