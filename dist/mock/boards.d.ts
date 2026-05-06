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
export declare const MOCK_BOARDS: MondayBoard[];
export declare const MOCK_TASKS: MondayTask[];
//# sourceMappingURL=boards.d.ts.map