const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { authService, tokenService } = require("../../../services");
const { Employee } = require("../../../models");

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const employee = await authService.login(email, password, Employee);
  const token = await tokenService.generateAuthToken(employee);
  res.json({
    info: {
      name: employee.firstname,
      designation: employee.designation,
    },
    token,
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(res);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  login,
  logout,
};
