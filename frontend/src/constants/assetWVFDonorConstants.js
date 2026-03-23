export const PAGINATION_PAGE_SIZE = 10;
export const DATE_DISPLAY_FORMAT = "DD-MMM-YYYY";

export const SERVICE_STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "In_Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];

export const SERVICE_DETAIL_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Under_Repair", label: "Under Repair" },
  { value: "Parts_Ordered", label: "Parts Ordered" },
  { value: "Completed", label: "Completed" },
  { value: "Unrepairable", label: "Unrepairable" },
];

// --- New: Donor-specific constants ---
export const DONOR_STATUS_OPTIONS = [
  { value: "sent", label: "Sent" },
  { value: "inprogress", label: "Inprogress" },
  { value: "ytd", label: "YTD" },
];

export const TABLE_SCROLL_HEIGHT = 320; // Common for both lists
export const MODAL_DEFAULT_WIDTH = 700; // Common for both lists
