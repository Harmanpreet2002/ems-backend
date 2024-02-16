const express = require("express");
const { adminController } = require("../../../controllers/v1");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post("/register-employee", auth('manageEmployees'), adminController.registerEmployee);
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout", adminController.logout);

module.exports = router;
