import { MondayBoard } from "../../mock/boards";
import { mondayService } from "../../services/monday.service";

export interface BoardRowData {
  board: MondayBoard;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

export const boardRowPartial = (data: BoardRowData): string => `
<tr class="hover">
  <td class="font-medium">${data.board.name}</td>
  <td>
    ${data.board.status === "Implementing" ? '<span class="badge badge-warning">Implementing</span>' : ''}
    ${data.board.status === "Onboarding" ? '<span class="badge badge-primary">Onboarding</span>' : ''}
    ${data.board.status === "Active" ? '<span class="badge badge-success">Active</span>' : ''}
    ${data.board.status === "Inactive" ? '<span class="badge badge-ghost">Inactive</span>' : ''}
  </td>
  <td>
    <div class="flex items-center gap-1">
      <span class="text-sm">${data.completedTasks}/${data.totalTasks}</span>
    </div>
  </td>
  <td>
    <div class="flex items-center gap-2">
      <progress class="progress progress-primary w-20" value="${data.percentage}" max="100"></progress>
      <span class="text-sm">${data.percentage}%</span>
    </div>
  </td>
  <td class="text-sm text-base-content/60">${data.board.lastUpdated.toLocaleDateString()}</td>
  <td>
    <div class="flex gap-2">
      <a href="/admin/boards/${data.board.id}" class="btn btn-sm btn-ghost">
        View Board
      </a>
      <button class="btn btn-sm btn-primary" hx-post="/admin/onboarding/start" hx-vals='{"boardId": "${data.board.id}"}' hx-target="#onboarding-result-${data.board.id}" hx-swap="innerHTML">
        Start Onboarding
      </button>
    </div>
    <div id="onboarding-result-${data.board.id}"></div>
  </td>
</tr>
`;

export async function renderBoardsTable(): Promise<string> {
  const boards = await mondayService.getBoards();
  const rows = await Promise.all(
    boards.map(async (board) => {
      const tasks = await mondayService.getBoardTasks(board.id);
      const clientTasks = tasks.filter((t) => t.type === "client-input");
      const completed = clientTasks.filter((t) => t.status === "completed").length;
      const percentage = clientTasks.length > 0 ? Math.round((completed / clientTasks.length) * 100) : 0;

      const data: BoardRowData = {
        board,
        totalTasks: clientTasks.length,
        completedTasks: completed,
        percentage,
      };

      return boardRowPartial(data);
    })
  );

  return rows.join("");
}
