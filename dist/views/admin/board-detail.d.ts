import { MondayBoard, MondayTask } from "../../mock/boards";
export interface BoardDetailData {
    board: MondayBoard;
    tasks: MondayTask[];
    progress: {
        total: number;
        completed: number;
        percentage: number;
    };
    onboardingStarted: boolean;
    portalLink?: string;
}
export declare const boardDetailView: (data: BoardDetailData) => string;
//# sourceMappingURL=board-detail.d.ts.map