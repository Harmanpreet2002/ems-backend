const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { authService, tokenService } = require("../../../services");
const { Admin, Employee } = require("../../../models");

const registerEmployee = catchAsync(async (req, res) => {
  const employee = await authService.register(req.body, Employee);
  res.status(httpStatus.CREATED).send({ employee });
});

const register = catchAsync(async (req, res) => {
  const admin = await authService.register(req.body, Admin);
  res.status(httpStatus.CREATED).send({ admin });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const admin = await authService.login(email, password, Admin);
  const accessToken = await tokenService.generateAuthToken(admin);
  res.send(accessToken);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(res);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  registerEmployee,
  register,
  login,
  logout,
};
