import { generateClientToken } from "../utils/token";
import { mondayService } from "./monday.service";
// In-memory store for onboarding states (replace with DB in production)
const onboardingStates = new Map();
class OnboardingService {
    /**
     * Start onboarding for a client
     * Generates a unique portal link with embedded token
     */
    async startOnboarding(boardId, baseUrl) {
        const board = await mondayService.getBoard(boardId);
        if (!board) {
            throw new Error(`Board ${boardId} not found`);
        }
        // Generate a client ID from the board name
        const clientId = board.name.toLowerCase().replace(/\s+/g, "-");
        // Generate signed token
        const token = generateClientToken(boardId, clientId);
        // Build portal URL
        const portalLink = `${baseUrl}/portal?token=${encodeURIComponent(token)}`;
        // Update board status
        await mondayService.startOnboarding(boardId);
        // Create onboarding state
        const state = {
            boardId,
            clientId,
            clientName: board.name,
            status: "in-progress",
            startedAt: new Date(),
            portalLink,
        };
        onboardingStates.set(boardId, state);
        return state;
    }
    /**
     * Get onboarding state for a board
     */
    async getOnboardingState(boardId) {
        return onboardingStates.get(boardId);
    }
    /**
     * Get all active onboardings
     */
    async getActiveOnboardings() {
        return Array.from(onboardingStates.values()).filter((o) => o.status === "in-progress");
    }
    /**
     * Complete onboarding for a board
     */
    async completeOnboarding(boardId) {
        const state = onboardingStates.get(boardId);
        if (state) {
            state.status = "completed";
            state.completedAt = new Date();
            onboardingStates.set(boardId, state);
        }
        return state;
    }
    /**
     * Get onboarding progress for a board
     */
    async getProgress(boardId) {
        const progress = await mondayService.getClientProgress(boardId);
        const tasks = await mondayService.getClientInputTasks(boardId);
        const completedTasks = tasks.filter((t) => t.status === "completed").length;
        const pendingTasks = tasks.filter((t) => t.status === "pending").length;
        return {
            totalTasks: tasks.length,
            completedTasks,
            pendingTasks,
            percentage: progress.percentage,
            sectionsComplete: completedTasks,
            totalSections: tasks.length,
        };
    }
}
export const onboardingService = new OnboardingService();
//# sourceMappingURL=onboarding.service.js.map