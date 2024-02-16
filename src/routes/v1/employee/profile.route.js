const express = require("express");
const { profileController } = require("../../../controllers/v1");
const upload = require("../../../middlewares/multer");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post("/upload", auth(), upload.single('profileImage'), profileController.uploadProfileImage);
router.get("/getImage",auth(), profileController.getEmployeeImage);
router.get("/deleteImage", auth(), profileController.deleteEmployeeImage);

module.exports = router;
