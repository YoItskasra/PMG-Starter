import { MondayBoard, MondayTask, MOCK_BOARDS, MOCK_TASKS } from "../mock/boards";

/**
 * MondayService - Data service layer for Monday.com integration
 * 
 * Currently uses mock data. Replace with real Monday.com GraphQL API calls
 * when ready for production.
 */
class MondayService {
  /**
   * Get all client boards
   */
  async getBoards(): Promise<MondayBoard[]> {
    // TODO: Replace with Monday GraphQL call
    return [...MOCK_BOARDS];
  }

  /**
   * Get a single board by ID
   */
  async getBoard(boardId: string): Promise<MondayBoard | undefined> {
    // TODO: Replace with Monday GraphQL call
    return MOCK_BOARDS.find((b) => b.id === boardId);
  }

  /**
   * Get all tasks for a specific board
   */
  async getBoardTasks(boardId: string): Promise<MondayTask[]> {
    // TODO: Replace with Monday GraphQL call
    return MOCK_TASKS.filter((t) => t.boardId === boardId);
  }

  /**
   * Get client-input tasks for a board
   */
  async getClientInputTasks(boardId: string): Promise<MondayTask[]> {
    const tasks = await this.getBoardTasks(boardId);
    return tasks.filter((t) => t.type === "client-input");
  }

  /**
   * Get internal-only tasks for a board
   */
  async getInternalTasks(boardId: string): Promise<MondayTask[]> {
    const tasks = await this.getBoardTasks(boardId);
    return tasks.filter((t) => t.type === "internal-only");
  }

  /**
   * Calculate completion percentage for client-input tasks
   */
  async getClientProgress(boardId: string): Promise<{ total: number; completed: number; percentage: number }> {
    const clientTasks = await this.getClientInputTasks(boardId);
    const total = clientTasks.length;
    const completed = clientTasks.filter((t) => t.status === "completed").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }

  /**
   * Count tasks pending client action across all boards
   */
  async getPendingClientTasksCount(): Promise<number> {
    const tasks = MOCK_TASKS.filter((t) => t.type === "client-input" && t.status === "pending");
    return tasks.length;
  }

  /**
   * Count completed tasks this week
   */
  async getCompletedThisWeekCount(): Promise<number> {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // For mock data, return a static count
    return 12;
  }

  /**
   * Count active onboardings (boards in "Onboarding" status)
   */
  async getActiveOnboardingsCount(): Promise<number> {
    return MOCK_BOARDS.filter((b) => b.status === "Onboarding").length;
  }

  /**
   * Start onboarding for a client board
   */
  async startOnboarding(boardId: string): Promise<{ success: boolean; boardId: string; clientName: string }> {
    const board = await this.getBoard(boardId);
    if (!board) {
      throw new Error(`Board ${boardId} not found`);
    }

    // TODO: Trigger real Monday.com orchestration
    // For now, just update the board status
    board.status = "Onboarding";
    board.lastUpdated = new Date();

    return {
      success: true,
      boardId,
      clientName: board.name,
    };
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: MondayTask["status"]): Promise<MondayTask | undefined> {
    // TODO: Replace with Monday GraphQL mutation
    const task = MOCK_TASKS.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
    }
    return task;
  }
}

export const mondayService = new MondayService();
