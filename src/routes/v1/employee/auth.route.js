const express = require("express");
const { employeeController } = require("../../../controllers/v1");

const router = express.Router();

router.post("/login", employeeController.login);
router.post("/logout", employeeController.logout);

module.exports = router;
