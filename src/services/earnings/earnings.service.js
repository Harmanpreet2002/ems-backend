const httpStatus = require("http-status");
const { attendanceService } = require("..");
const monthNames = require("../../helpers/monthNames");
const { Employee, Earnings } = require("../../models");

// const STANDARD_WORKING_HOURS = 8;

async function calculateEarnings(employee, workingHoursData) {
  const salary = employee.salary;
  const earningsByMonth = [];
  for (const workingHours of workingHoursData) {
    const totalWorkingHours = workingHours.totalWorkingHours;
    const overtimeHours = workingHours.overtimeHours;
    const year = workingHours.year;
    const month = monthNames[workingHours.month - 1];
    const employeeId = employee.id;

    const regularRate = salary / (30 * process.env.STANDARD_WORKING_HOURS);
    const overtimeRate = regularRate * process.env.OT_RATE;

    const regularEarnings = totalWorkingHours * regularRate;
    const overtimeEarnings = overtimeHours * overtimeRate;

    const totalEarnings = regularEarnings + overtimeEarnings;

    const existingEarnings = await Earnings.findOneAndUpdate(
      {
        employeeId,
        year,
        month,
      },
      {
        $set: {
          employeeId,
          year,
          month,
          earnings: Number(totalEarnings.toFixed(2)),
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    earningsByMonth.push(existingEarnings);
  }

  return earningsByMonth;
}

const getEarnings = async (employeeId) => {
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Employee not found" });
  }
  const dailyWorkingHours = await attendanceService.getWorkingHoursByDay(
    employeeId
  );
  const monthlyWorkingHours = await attendanceService.getWorkingHoursByMonth(
    employeeId
  );
  const earnings = await calculateEarnings(employee, monthlyWorkingHours);
  return earnings;
};

const getEarningById = async (id) => {
  const earning = await Earnings.findById(id);
  if (!earning) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Earning not found" });
  }
  return earning;
};

module.exports = {
  getEarnings,
  getEarningById,
};
