export interface MondayBoard {
  id: string;
  name: string;
  status: "Implementing" | "Onboarding" | "Active" | "Inactive";
  lastUpdated: Date;
}

export interface MondayTask {
  id: string;
  boardId: string;
  name: string;
  type: "client-input" | "internal-only";
  status: "pending" | "in-progress" | "completed";
  metadata?: Record<string, any>;
}

export const MOCK_BOARDS: MondayBoard[] = [
  {
    id: "board-1",
    name: "Acme Inc",
    status: "Implementing",
    lastUpdated: new Date("2024-03-15T10:30:00Z"),
  },
  {
    id: "board-2",
    name: "Brightside Logistics",
    status: "Onboarding",
    lastUpdated: new Date("2024-03-14T14:20:00Z"),
  },
  {
    id: "board-3",
    name: "Summit Staffing",
    status: "Active",
    lastUpdated: new Date("2024-03-13T09:15:00Z"),
  },
  {
    id: "board-4",
    name: "Evergreen Retail",
    status: "Implementing",
    lastUpdated: new Date("2024-03-12T16:45:00Z"),
  },
  {
    id: "board-5",
    name: "Northwind Payroll",
    status: "Onboarding",
    lastUpdated: new Date("2024-03-11T11:00:00Z"),
  },
];

export const MOCK_TASKS: MondayTask[] = [
  // Acme Inc - board-1
  {
    id: "task-1",
    boardId: "board-1",
    name: "Upload W-9",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-2",
    boardId: "board-1",
    name: "Sign engagement letter",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-3",
    boardId: "board-1",
    name: "Provide bank account info",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-4",
    boardId: "board-1",
    name: "Answer payroll setup questions",
    type: "client-input",
    status: "in-progress",
  },
  {
    id: "task-5",
    boardId: "board-1",
    name: "Upload employee census",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-6",
    boardId: "board-1",
    name: "Create Payroll Workspace",
    type: "internal-only",
    status: "pending",
  },
  {
    id: "task-7",
    boardId: "board-1",
    name: "Configure tax jurisdictions",
    type: "internal-only",
    status: "pending",
  },
  {
    id: "task-8",
    boardId: "board-1",
    name: "Set up EIN verification",
    type: "internal-only",
    status: "in-progress",
  },

  // Brightside Logistics - board-2
  {
    id: "task-9",
    boardId: "board-2",
    name: "Upload W-9",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-10",
    boardId: "board-2",
    name: "Sign engagement letter",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-11",
    boardId: "board-2",
    name: "Provide bank account info",
    type: "client-input",
    status: "in-progress",
  },
  {
    id: "task-12",
    boardId: "board-2",
    name: "Answer payroll setup questions",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-13",
    boardId: "board-2",
    name: "Upload employee census",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-14",
    boardId: "board-2",
    name: "Create Payroll Workspace",
    type: "internal-only",
    status: "in-progress",
  },
  {
    id: "task-15",
    boardId: "board-2",
    name: "Configure tax jurisdictions",
    type: "internal-only",
    status: "pending",
  },

  // Summit Staffing - board-3
  {
    id: "task-16",
    boardId: "board-3",
    name: "Upload W-9",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-17",
    boardId: "board-3",
    name: "Sign engagement letter",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-18",
    boardId: "board-3",
    name: "Provide bank account info",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-19",
    boardId: "board-3",
    name: "Answer payroll setup questions",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-20",
    boardId: "board-3",
    name: "Upload employee census",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-21",
    boardId: "board-3",
    name: "Create Payroll Workspace",
    type: "internal-only",
    status: "completed",
  },
  {
    id: "task-22",
    boardId: "board-3",
    name: "Configure tax jurisdictions",
    type: "internal-only",
    status: "completed",
  },
  {
    id: "task-23",
    boardId: "board-3",
    name: "Set up EIN verification",
    type: "internal-only",
    status: "completed",
  },

  // Evergreen Retail - board-4
  {
    id: "task-24",
    boardId: "board-4",
    name: "Upload W-9",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-25",
    boardId: "board-4",
    name: "Sign engagement letter",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-26",
    boardId: "board-4",
    name: "Provide bank account info",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-27",
    boardId: "board-4",
    name: "Answer payroll setup questions",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-28",
    boardId: "board-4",
    name: "Create Payroll Workspace",
    type: "internal-only",
    status: "pending",
  },
  {
    id: "task-29",
    boardId: "board-4",
    name: "Configure tax jurisdictions",
    type: "internal-only",
    status: "pending",
  },

  // Northwind Payroll - board-5
  {
    id: "task-30",
    boardId: "board-5",
    name: "Upload W-9",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-31",
    boardId: "board-5",
    name: "Sign engagement letter",
    type: "client-input",
    status: "completed",
  },
  {
    id: "task-32",
    boardId: "board-5",
    name: "Provide bank account info",
    type: "client-input",
    status: "in-progress",
  },
  {
    id: "task-33",
    boardId: "board-5",
    name: "Answer payroll setup questions",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-34",
    boardId: "board-5",
    name: "Upload employee census",
    type: "client-input",
    status: "pending",
  },
  {
    id: "task-35",
    boardId: "board-5",
    name: "Create Payroll Workspace",
    type: "internal-only",
    status: "in-progress",
  },
  {
    id: "task-36",
    boardId: "board-5",
    name: "Set up EIN verification",
    type: "internal-only",
    status: "pending",
  },
];
