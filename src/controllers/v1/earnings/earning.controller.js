const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { earningsService } = require("../../../services");

const getEarnings = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const earnings = await earningsService.getEarnings(employeeId);
  res.status(httpStatus.OK).send(earnings);
});

const getEarningById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const earning = await earningsService.getEarningById(id);
  res.status(200).send(earning);
});

module.exports = {
  getEarnings,
  getEarningById,
};
