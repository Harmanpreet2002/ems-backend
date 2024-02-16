const express = require("express");
const { standupController } = require("../../../controllers/v1");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post("/add", auth('getAttendance'), standupController.createStandup);
router.get("/get", auth(), standupController.getStandup);

module.exports = router;
