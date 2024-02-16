const jwt = require("jsonwebtoken");
const config = require("../config/config");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roleRights } = require("../config/roles");

const verifyToken = (req, resolve, reject, requiredRights) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reject(
      new ApiError(httpStatus.UNAUTHORIZED, "Authentication required")
    );
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, config.jwt.secret, (err, decoded) => {
    if (err) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
    }
    req.employee = decoded;

    if (requiredRights.length) {
      const employeeRights = roleRights.get(decoded.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        employeeRights.includes(requiredRight)
      );
      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }
    
    resolve();
  });
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      verifyToken(req, resolve, reject, requiredRights);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
