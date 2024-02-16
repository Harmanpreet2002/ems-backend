const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { employeeService } = require("../../../services");
const { ProfileImage } = require("../../../models");
const fs = require("fs");

const uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "No file uploaded." });
  }
  const employeeId = req.employee.sub;
  const profileImage = {
    path: req.file.path,
    mimeType: req.file.mimetype,
  };
  const image = await employeeService.uploadProfileImage(
    employeeId,
    profileImage
  );

  res.setHeader("Content-Type", image.mimeType);
  res.status(httpStatus.CREATED).sendFile(image.image);
});

const getEmployeeImage = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const image = await ProfileImage.findOne({
    employeeId,
  });
  if(!image) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Employee's profile image not found." });
    return;
  }
  res.setHeader("Content-Type", image.mimeType);
  res.status(httpStatus.OK).sendFile(image.image);
});

const deleteEmployeeImage = catchAsync(async (req, res) => {
  const employeeId = req.employee.sub;
  const existingImage = await ProfileImage.findOne({ employeeId });
  if (!existingImage) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Employee's profile image not found." });
  }
  try {
    fs.unlinkSync(existingImage.image);
  } catch (error) {
    console.error("Error while deleting image file:", error);
  }
  await ProfileImage.deleteOne({ employeeId });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  uploadProfileImage,
  getEmployeeImage,
  deleteEmployeeImage,
};
