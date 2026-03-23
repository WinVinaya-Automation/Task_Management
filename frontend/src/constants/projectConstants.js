// src/constants/projectConstants.js

export const DEFAULT_PAGE_SIZE = 10;

export const STATUS_OPTIONS = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "overdue", label: "Overdue" },
    { value: "hold", label: "Hold" },
];

export const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

export const PROJECT_TYPE_OPTIONS = [
    { value: "IT", label: "IT" },
    { value: "Non-IT", label: "Non-IT" },
];

export const PROJECT_OWNER = [
    { value: "Baskar", label: "Baskar" },
    { value: "Akila", label: "Akila" },
];

export const PROJECT_TAGS = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "design", label: "Design" },
    { value: "devops", label: "DevOps" },
    { value: "testing", label: "Testing" },
    { value: "research", label: "Research" },
    { value: "documentation", label: "Documentation" },
    { value: "bugfix", label: "Bug Fix" },
];