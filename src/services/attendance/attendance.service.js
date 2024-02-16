const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { Attendance, Standup, WorkTimes, Holiday } = require("../../models");
const mongoose = require("mongoose");

const createAttendance = async (employeeId, action) => {
  if (!employeeId || ![process.env.ACTION_PUNCH_IN, process.env.ACTION_PUNCH_OUT].includes(action)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid input parameters");
  }

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0];
  const query = { employeeId, date };
  const attendanceRecord = await Attendance.findOne(query);

  if (!attendanceRecord) {
    const newAttendanceRecord = new Attendance({
      employeeId,
      date,
      punchInTimes: [],
      punchOutTimes: [],
    });

    if (action === process.env.ACTION_PUNCH_IN) {
      newAttendanceRecord.punchInTimes.push(currentDate);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action sequence");
    }

    await newAttendanceRecord.save();
    return newAttendanceRecord;
  } else {
    const { punchInTimes, punchOutTimes } = attendanceRecord;

    if (action === process.env.ACTION_PUNCH_IN) {
      if (punchInTimes.length > punchOutTimes.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action sequence");
      }
      attendanceRecord.punchInTimes.push(currentDate);
    } else {
      if (punchOutTimes.length >= punchInTimes.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action sequence");
      }
      attendanceRecord.punchOutTimes.push(currentDate);
    }

    await attendanceRecord.save();
    return attendanceRecord;
  }
};

const getEmployeeAttendance = async (employeeId) => {
  if (!employeeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid input parameters");
  }
  const attendanceRecords = await Attendance.find({ employeeId }).sort({
    date: -1,
  });
  const totalCount = await Attendance.countDocuments({ employeeId });
  return {
    attendanceRecords,
    totalCount,
  };
};

const createStandup = async (standupBody) => {
  return Standup.create(standupBody);
};

const getStandup = async (employeeId) => {
  if (!employeeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid input parameters");
  }
  return await Standup.find({ employeeId });
};

const calculateTotalWorkingHours = (attendanceRecord, holidays) => {
  let totalWorkingHours = 0;
  let overtimeHours = 0;

  if (
    attendanceRecord.punchInTimes.length !==
    attendanceRecord.punchOutTimes.length
  ) {
    return null;
  }

  for (let i = 0; i < attendanceRecord.punchInTimes.length; i++) {
    const punchInTimeUTC = new Date(attendanceRecord.punchInTimes[i]);
    const punchOutTimeUTC = new Date(attendanceRecord.punchOutTimes[i]);
    const calculatedTime =
      (punchOutTimeUTC.getTime() - punchInTimeUTC.getTime()) / (1000 * 60 * 60);
    const hours = Math.floor(calculatedTime);
    const minutes = Math.round((calculatedTime - hours) * 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const durationInHours = +`${hours}.${formattedMinutes}`;

    const isHoliday = holidays.some((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        punchInTimeUTC.getFullYear() === holidayDate.getFullYear() &&
        punchInTimeUTC.getMonth() === holidayDate.getMonth() &&
        punchInTimeUTC.getDate() === holidayDate.getDate()
      );
    });

    const isWeekend =
      punchInTimeUTC.getDay() === 6 || punchInTimeUTC.getDay() === 0;

    if (isWeekend && isHoliday) {
      overtimeHours += durationInHours;
    } else if (isWeekend || isHoliday) {
      overtimeHours += durationInHours;
    } else {
      totalWorkingHours += durationInHours;
    }
  }

  if (
    attendanceRecord.punchInTimes.every((punchIn) => {
      const date = new Date(punchIn);
      return (
        date.getDay() !== 6 &&
        date.getDay() !== 0 &&
        !holidays.some((holiday) => {
          const holidayDate = new Date(holiday.date);
          return (
            date.getFullYear() === holidayDate.getFullYear() &&
            date.getMonth() === holidayDate.getMonth() &&
            date.getDate() === holidayDate.getDate()
          );
        })
      );
    })
  ) {
    overtimeHours = Math.max(totalWorkingHours - process.env.STANDARD_WORKING_HOURS, 0);
  }

  return {
    totalWorkingHours,
    overtimeHours,
  };
};

const getWorkingHoursByDay = async (employeeId) => {
  const allAttendanceRecords = await Attendance.find({ employeeId });
  const holidays = await Holiday.find();

  const results = [];

  for (const attendanceRecord of allAttendanceRecords) {
    const existingWorkTimes = await WorkTimes.findOne({
      employeeId: attendanceRecord.employeeId,
      date: attendanceRecord.date,
    });

    const workTimes = calculateTotalWorkingHours(attendanceRecord, holidays);

    if (existingWorkTimes) {
      existingWorkTimes.workTimes = workTimes;
      await existingWorkTimes.save();
      results.push(existingWorkTimes);
    } else {
      const workTimesDocument = new WorkTimes({
        employeeId: attendanceRecord.employeeId,
        date: attendanceRecord.date,
        workTimes,
      });
      await workTimesDocument.save();
      results.push(workTimesDocument);
    }
  }

  return results;
};

const getWorkingHoursByMonth = async (employeeId) => {
  const aggregationPipeline = [
    {
      $match: { employeeId: new mongoose.Types.ObjectId(employeeId) },
    },
    {
      $project: {
        date: "$date",
        year: { $year: "$date" },
        month: { $month: "$date" },
        totalWorkingHours: {
          $ifNull: [{ $toDouble: "$workTimes.totalWorkingHours" }, 0],
        },
        overtimeHours: {
          $ifNull: [{ $toDouble: "$workTimes.overtimeHours" }, 0],
        },
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        totalWorkingHours: { $sum: "$totalWorkingHours" },
        overtimeHours: { $sum: "$overtimeHours" },
        dates: { $push: "$date" },
      },
    },
    {
      $project: {
        year: "$_id.year",
        month: "$_id.month",
        totalWorkingHours: 1,
        overtimeHours: 1,
        dates: 1,
        _id: 0,
      },
    },
  ];

  const monthlyResults = await WorkTimes.aggregate(aggregationPipeline);

  const holidays = await Holiday.find();

  for (const result of monthlyResults) {
    const { dates } = result;
    const sortedDates = dates.sort((a, b) => a - b);
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    if (firstDate && lastDate) {
      const startDate = new Date(firstDate);
      const endDate = new Date(lastDate);

      while (startDate <= endDate) {
        const dayOfWeek = startDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          result.totalWorkingHours += process.env.STANDARD_WORKING_HOURS;
        } else {
          const isHoliday = holidays.some((holiday) => {
            const holidayDate = new Date(holiday.date);
            return (
              startDate.toDateString() === holidayDate.toDateString() &&
              holidayDate.getDay() !== 0 &&
              holidayDate.getDay() !== 6
            );
          });

          if (isHoliday) {
            result.totalWorkingHours += process.env.STANDARD_WORKING_HOURS;
          }
        }
        startDate.setDate(startDate.getDate() + 1);
      }
    }
  }

  return monthlyResults;
};

module.exports = {
  createAttendance,
  getEmployeeAttendance,
  createStandup,
  getStandup,
  getWorkingHoursByDay,
  getWorkingHoursByMonth,
};
