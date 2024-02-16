const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const toJSON = require("../plugins/toJSON.plugin");
const { roles } = require("../../config/roles");

const employeeSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: true,
      validate(value) {
        if (!/^\d{6}$/.test(value)) {
          throw new Error("Invalid postal code");
        }
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      validate(value) {
        if (!/^\+\d{1,3}\d{5,15}$/.test(value)) {
          throw new Error("Invalid phone number");
        }
      },
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Frontend Developer",
        "Backend Developer",
        "MERN Stack Developer",
        "SEO",
        "HR",
        "PHP Developer",
        "React Developer",
      ],
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "employee",
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.plugin(toJSON);

employeeSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const employee = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!employee;
};

employeeSchema.methods.isPasswordMatch = async function (password) {
  const employee = this;
  return bcrypt.compare(password, employee.password);
};

employeeSchema.pre("save", async function (next) {
  const employee = this;
  if (employee.isModified("password")) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
