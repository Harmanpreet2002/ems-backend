const express = require("express");
const { earningController } = require("../../../controllers/v1");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.get("/get-earnings", auth("getEarnings"), earningController.getEarnings);
router.get(
  "/get-earning-by-id/:id",
  auth("getEarnings"),
  earningController.getEarningById
);

module.exports = router;
