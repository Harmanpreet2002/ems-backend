const allRoles = {
    employee: ['imageUploader', 'getEmployee', 'attendanceMaker', 'getAttendance', 'getEarnings'],
    admin: ['getEmployees', 'manageEmployees', 'getEmployee', 'getAttendance', 'getEarnings'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
    roles,
    roleRights
}