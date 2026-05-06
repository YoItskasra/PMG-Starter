import { MondayBoard, MondayTask } from "../mock/boards";
/**
 * MondayService - Data service layer for Monday.com integration
 *
 * Currently uses mock data. Replace with real Monday.com GraphQL API calls
 * when ready for production.
 */
declare class MondayService {
    /**
     * Get all client boards
     */
    getBoards(): Promise<MondayBoard[]>;
    /**
     * Get a single board by ID
     */
    getBoard(boardId: string): Promise<MondayBoard | undefined>;
    /**
     * Get all tasks for a specific board
     */
    getBoardTasks(boardId: string): Promise<MondayTask[]>;
    /**
     * Get client-input tasks for a board
     */
    getClientInputTasks(boardId: string): Promise<MondayTask[]>;
    /**
     * Get internal-only tasks for a board
     */
    getInternalTasks(boardId: string): Promise<MondayTask[]>;
    /**
     * Calculate completion percentage for client-input tasks
     */
    getClientProgress(boardId: string): Promise<{
        total: number;
        completed: number;
        percentage: number;
    }>;
    /**
     * Count tasks pending client action across all boards
     */
    getPendingClientTasksCount(): Promise<number>;
    /**
     * Count completed tasks this week
     */
    getCompletedThisWeekCount(): Promise<number>;
    /**
     * Count active onboardings (boards in "Onboarding" status)
     */
    getActiveOnboardingsCount(): Promise<number>;
    /**
     * Start onboarding for a client board
     */
    startOnboarding(boardId: string): Promise<{
        success: boolean;
        boardId: string;
        clientName: string;
    }>;
    /**
     * Update task status
     */
    updateTaskStatus(taskId: string, status: MondayTask["status"]): Promise<MondayTask | undefined>;
}
export declare const mondayService: MondayService;
export {};
//# sourceMappingURL=monday.service.d.ts.map