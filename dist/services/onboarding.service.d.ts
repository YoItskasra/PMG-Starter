export interface OnboardingState {
    boardId: string;
    clientId: string;
    clientName: string;
    status: "not-started" | "in-progress" | "completed";
    startedAt?: Date;
    completedAt?: Date;
    portalLink?: string;
}
declare class OnboardingService {
    /**
     * Start onboarding for a client
     * Generates a unique portal link with embedded token
     */
    startOnboarding(boardId: string, baseUrl: string): Promise<OnboardingState>;
    /**
     * Get onboarding state for a board
     */
    getOnboardingState(boardId: string): Promise<OnboardingState | undefined>;
    /**
     * Get all active onboardings
     */
    getActiveOnboardings(): Promise<OnboardingState[]>;
    /**
     * Complete onboarding for a board
     */
    completeOnboarding(boardId: string): Promise<OnboardingState | undefined>;
    /**
     * Get onboarding progress for a board
     */
    getProgress(boardId: string): Promise<{
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        percentage: number;
        sectionsComplete: number;
        totalSections: number;
    }>;
}
export declare const onboardingService: OnboardingService;
export {};
//# sourceMappingURL=onboarding.service.d.ts.map