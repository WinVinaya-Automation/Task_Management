export const PAGE_SIZE = 10;
export const TABLE_SCROLL_Y = 295;
export const MODAL_WIDTH = 700;
export const DATE_FORMAT = "DD-MMM-YYYY";

// Role Configuration: Defines visibility and tag colors for each role.
// 'showAssignedTo': true if 'Assigned To' field should be visible and required.
// 'showStudentName': true if 'Student Name' field should be visible and required.
// 'showBatchName': true if 'Batch Name' field should be visible and required.
// 'showBatchDates': true if 'Batch Dates' field (RangePicker) should be visible and required.
export const ROLE_CONFIG = {
  student: {
    tagColor: "blue",
    showAssignedTo: false,
    showStudentName: true,
    showBatchName: true,
    showBatchDates: true,
  },
  intern: {
    tagColor: "cyan",
    showAssignedTo: true, // Assigned To is visible and required for Intern
    showStudentName: false, // Student Name is hidden for Intern
    showBatchName: false, // Batch Name is hidden for Intern
    showBatchDates: true, // Batch Dates is visible and required for Intern
  },
  employee: {
    tagColor: "purple",
    showAssignedTo: true,
    showStudentName: false,
    showBatchName: false,
    showBatchDates: false,
  },
  others: {
    tagColor: "orange",
    showAssignedTo: true,
    showStudentName: false,
    showBatchName: false,
    showBatchDates: false,
  },
};

export const ROLE_OPTIONS = [
  { value: "Student", label: "Student" },
  { value: "Employee", label: "Employee" },
  { value: "Intern", label: "Intern" },
  { value: "Others", label: "Others" },
];
