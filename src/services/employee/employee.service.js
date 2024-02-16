const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { Employee, ProfileImage } = require("../../models");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const getEmployeeByEmail = async (email) => {
  return Employee.findOne({ email });
};

const uploadProfileImage = async (employeeId, profileImage) => {
  if (!employeeId || !profileImage) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid input parameters");
  }
  const { path, mimeType } = profileImage;
  let image = await ProfileImage.findOne({ employeeId });
  if(!image) {
    image = new ProfileImage({
      employeeId,
      image: path,
      mimeType
    })
  }else {
    image.image = path;
    image.mimeType = mimeType;
  }
  await image.save();
  return image;
};

module.exports = {
  getEmployeeByEmail,
  uploadProfileImage,
};
