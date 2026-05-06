import { Hono } from "hono";
import { adminAuth } from "../middleware/adminAuth";
import { mondayService } from "../services/monday.service";
import { onboardingService } from "../services/onboarding.service";
import { layout } from "../views/layout";
import { dashboardView } from "../views/admin/dashboard";
import { boardDetailView } from "../views/admin/board-detail";
import { renderBoardsTable } from "../views/partials/board-row";
import { renderTaskList } from "../views/partials/task-row";

const adminRoutes = new Hono();

// Apply admin auth to all routes
adminRoutes.use("/*", adminAuth);

// Dashboard page
adminRoutes.get("/", async (c) => {
  const boards = await mondayService.getBoards();
  const activeOnboardings = await mondayService.getActiveOnboardingsCount();
  const pendingClientTasks = await mondayService.getPendingClientTasksCount();
  const completedThisWeek = await mondayService.getCompletedThisWeekCount();

  const content = dashboardView({
    totalClients: boards.length,
    activeOnboardings,
    pendingClientTasks,
    completedThisWeek,
    boards,
  });

  return c.html(layout("Dashboard", content));
});

// Boards table partial (HTMX)
adminRoutes.get("/boards", async (c) => {
  const html = await renderBoardsTable();
  return c.html(html);
});

// Board detail page
adminRoutes.get("/boards/:id", async (c) => {
  const boardId = c.req.param("id");
  const board = await mondayService.getBoard(boardId);

  if (!board) {
    return c.notFound();
  }

  const tasks = await mondayService.getBoardTasks(boardId);
  const progress = await mondayService.getClientProgress(boardId);
  const onboardingState = await onboardingService.getOnboardingState(boardId);

  const content = boardDetailView({
    board,
    tasks,
    progress,
    onboardingStarted: !!onboardingState,
    portalLink: onboardingState?.portalLink,
  });

  return c.html(layout(`${board.name} - Board Detail`, content));
});

// Tasks partial (HTMX polling)
adminRoutes.get("/boards/:id/tasks", async (c) => {
  const boardId = c.req.param("id");
  const tasks = await mondayService.getBoardTasks(boardId);
  return c.html(renderTaskList(tasks));
});

// Mark task complete
adminRoutes.post("/tasks/:taskId/complete", async (c) => {
  const taskId = c.req.param("taskId");
  const task = await mondayService.updateTaskStatus(taskId, "completed");

  if (!task) {
    return c.notFound();
  }

  const tasks = await mondayService.getBoardTasks(task.boardId);
  return c.html(renderTaskList(tasks));
});

// Start onboarding
adminRoutes.post("/onboarding/start", async (c) => {
  const formData = await c.req.parseBody();
  const boardId = formData.boardId as string;

  if (!boardId) {
    return c.text("Board ID required", 400);
  }

  try {
    const baseUrl = `${c.req.header("x-forwarded-proto") || "http"}://${c.req.header("host") || "localhost:3000"}`;
    const state = await onboardingService.startOnboarding(boardId, baseUrl);

    // If HTMX request, return the portal link button
    if (c.req.header("HX-Request") === "true") {
      return c.html(`
        <div class="join mt-2">
          <input type="text" class="input input-bordered join-item text-sm w-80" value="${state.portalLink}" readonly id="portal-link-input" />
          <button class="btn btn-primary join-item" onclick="navigator.clipboard.writeText(document.getElementById('portal-link-input').value); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy Link', 2000);">
            Copy Link
          </button>
        </div>
        <div class="text-sm text-success mt-1">Onboarding started successfully!</div>
      `);
    }

    return c.json({ success: true, portalLink: state.portalLink });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start onboarding";
    return c.text(message, 500);
  }
});

// Active onboardings page
adminRoutes.get("/onboarding/active", async (c) => {
  const onboardings = await onboardingService.getActiveOnboardings();

  const content = `
<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold">Active Onboarding</h1>
    <p class="text-base-content/60">Track in-flight client onboarding sessions</p>
  </div>

  ${onboardings.length === 0 ? `
    <div class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>No active onboardings. Start one from the dashboard.</span>
    </div>
  ` : `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${onboardings.map(o => `
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h3 class="card-title">${o.clientName}</h3>
            <p class="text-sm text-base-content/60">Started: ${o.startedAt?.toLocaleDateString()}</p>
            <div class="card-actions justify-end mt-4">
              <a href="/admin/boards/${o.boardId}" class="btn btn-primary btn-sm">View Progress</a>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}
</div>
`;

  return c.html(layout("Active Onboarding", content));
});

// Onboarding status partial (HTMX polling)
adminRoutes.get("/onboarding/status", async (c) => {
  const onboardings = await onboardingService.getActiveOnboardings();

  const html = `
<div class="space-y-4">
  ${onboardings.map(async o => {
    const progress = await onboardingService.getProgress(o.boardId);
    return `
      <div class="flex items-center justify-between p-3 bg-base-100 rounded-lg">
        <div>
          <div class="font-medium">${o.clientName}</div>
          <div class="text-sm text-base-content/60">${progress.sectionsComplete} of ${progress.totalSections} sections complete</div>
        </div>
        <div class="flex items-center gap-2">
          <progress class="progress progress-primary w-24" value="${progress.percentage}" max="100"></progress>
          <span class="text-sm font-medium">${progress.percentage}%</span>
        </div>
      </div>
    `;
  })}
</div>
`;

  return c.html(html);
});

// Clients list page
adminRoutes.get("/clients", async (c) => {
  const boards = await mondayService.getBoards();

  const content = `
<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold">Clients</h1>
    <p class="text-base-content/60">All client boards and their status</p>
  </div>

  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${boards.map(b => `
              <tr>
                <td class="font-medium">${b.name}</td>
                <td>
                  ${b.status === "Implementing" ? '<span class="badge badge-warning">Implementing</span>' : ''}
                  ${b.status === "Onboarding" ? '<span class="badge badge-primary">Onboarding</span>' : ''}
                  ${b.status === "Active" ? '<span class="badge badge-success">Active</span>' : ''}
                  ${b.status === "Inactive" ? '<span class="badge badge-ghost">Inactive</span>' : ''}
                </td>
                <td class="text-sm text-base-content/60">${b.lastUpdated.toLocaleDateString()}</td>
                <td>
                  <a href="/admin/boards/${b.id}" class="btn btn-sm btn-ghost">View Board</a>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`;

  return c.html(layout("Clients", content));
});

export default adminRoutes;
