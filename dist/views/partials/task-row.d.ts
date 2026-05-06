import { MondayTask } from "../../mock/boards";
export interface TaskRowData {
    task: MondayTask;
}
export declare const taskRowPartial: (data: TaskRowData) => string;
export declare function renderTaskList(tasks: MondayTask[]): string;
//# sourceMappingURL=task-row.d.ts.map