const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../../config/config");
const { tokenTypes } = require("../../config/tokens");

const generateToken = (employeeId, employeeRole, expires, type, secret = config.jwt.secret) =>{
   const payload = {
    sub: employeeId,
    role: employeeRole,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
   };
   return jwt.sign(payload, secret);
}

const generateAuthToken = async (employee) =>{
   const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
   const accessToken = generateToken(employee.id, employee.role, accessTokenExpires, tokenTypes.ACCESS);
   return {
    accessToken: accessToken,
    expires: accessTokenExpires.toDate(),
   }
}

module.exports = {
   generateAuthToken
}