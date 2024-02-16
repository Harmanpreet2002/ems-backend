const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");

const register = async (body, Collection) => {
  if (await Collection.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return Collection.create(body);
};

const login = async (email, password, Collection) => {
  const data = await Collection.findOne({ email });
  if (!data || !(await data.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return data;
};

const logout = async (res) => {
  res.clearCookie("access_token", { httpOnly: false, secure: false });
};

module.exports = {
  register,
  login,
  logout,
};
