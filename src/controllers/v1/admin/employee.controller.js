const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const xlsx = require("xlsx");
const csvParser = require("csv-parser");
const fs = require("fs");
const Holiday = require("../../../models/admin/holidays.model");
const { Employee } = require("../../../models");

const handleHolidayUpload = catchAsync(async (req, res) => {
  if (!req.file) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "No file uploaded." });
  }
  const uploadedFilePath = req.file.path;
  if (
    req.file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    const workbook = xlsx.readFile(uploadedFilePath);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const holidays = data.map((item) => ({
      holidayName: item.Holiday,
      date: item.Date,
      day: item.Day,
    }));

    await Holiday.create(holidays);

    console.log("Parsed data from XLSX file:", holidays);
  } else if (req.file.mimetype === "text/csv") {
    const results = [];
    fs.createReadStream(uploadedFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        const validHolidays = results
          .filter((item) => item.Holiday && item.Date && item.Day)
          .map((item) => {
            // Split the date string into parts
            const dateParts = item.Date.split("-");
            const day = parseInt(dateParts[0]);
            const month = dateParts[1]; // Assuming the month is represented as a three-letter abbreviation

            // Convert month abbreviation to month number (1-12)
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            const monthNumber = monthNames.indexOf(month) + 1;
            const currentYear = new Date().getFullYear();

            // Create the date with the current year and extracted month, day
            const date = new Date(Date.UTC(currentYear, monthNumber - 1, day)); // Subtract 1 from the month because months are 0-indexed

            return {
              holidayName: item.Holiday,
              date,
              day: item.Day,
            };
          });
        if (validHolidays.length === 0) {
          return res.status(httpStatus.BAD_REQUEST).json({
            error: "No valid data to insert.",
          });
        }
        await Holiday.insertMany(validHolidays);
      });
  } else {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "Invalid file format" });
  }

  res
    .status(httpStatus.OK)
    .json({ message: "Data parsed and logged in console." });
});

const getAllHolidays = catchAsync(async (req, res) => {
  const holidays = await Holiday.find();
  res.status(httpStatus.OK).send(holidays);
});

const updateHolidayById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedHoliday = await Holiday.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updatedHoliday) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Holiday not found" });
  }
  res.status(httpStatus.OK).json(updatedHoliday);
});

const getAllEmployees = catchAsync(async (req, res) => {
  const employees = await Employee.find();
  res.status(httpStatus.OK).send(employees);
});

const getEmployeeById = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const employee = await Employee.findById(employeeId);
  res.status(httpStatus.OK).send(employee);
});

const updateEmployeeById = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const updatedBody = req.body;
  const updatedEmployee = await Employee.findByIdAndUpdate(
    employeeId,
    updatedBody,
    { new: true }
  );
  res.status(httpStatus.OK).send(updatedEmployee);
});

module.exports = {
  handleHolidayUpload,
  getAllHolidays,
  updateHolidayById,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
};
