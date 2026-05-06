import { MondayBoard } from "../../mock/boards";
export interface BoardRowData {
    board: MondayBoard;
    totalTasks: number;
    completedTasks: number;
    percentage: number;
}
export declare const boardRowPartial: (data: BoardRowData) => string;
export declare function renderBoardsTable(): Promise<string>;
//# sourceMappingURL=board-row.d.ts.map