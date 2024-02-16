const express = require("express");
const employeeAuthRoute = require("./employee/auth.route");
const attendanceRoute = require("./attendance/attendance.route");
const standupRoute = require("./attendance/standup.route");
const profileRoute = require("./employee/profile.route");
const adminAuthRoute = require("./admin/auth.route");
const adminEmpRoute = require("./admin/employee.route");
const earningRoute = require("./earnings/earning.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/employee",
    route: employeeAuthRoute,
  },
  {
    path: "/attendance",
    route: attendanceRoute,
  },
  {
    path: "/standup",
    route: standupRoute,
  },
  {
    path: "/image",
    route: profileRoute,
  },
  {
    path: "/admin",
    route: adminAuthRoute
  },
  {
    path: "/admin-emp",
    route: adminEmpRoute
  },
  {
    path: "/earning",
    route: earningRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
