import { MondayBoard } from "../../mock/boards";
export interface DashboardData {
    totalClients: number;
    activeOnboardings: number;
    pendingClientTasks: number;
    completedThisWeek: number;
    boards: MondayBoard[];
}
export declare const dashboardView: (data: DashboardData) => string;
//# sourceMappingURL=dashboard.d.ts.map