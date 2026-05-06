import { Hono } from "hono";
import { verifyClientToken } from "../utils/token";
import { mondayService } from "../services/monday.service";
import { onboardingService } from "../services/onboarding.service";

const portalRoutes = new Hono();

// Client portal entry point
portalRoutes.get("/", async (c) => {
  const token = c.req.query("token");

  if (!token) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invalid Link | PMG Portal</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body class="bg-base-200 min-h-screen flex items-center justify-center">
        <div class="card w-96 bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-error"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            </div>
            <h2 class="card-title">Invalid or Missing Link</h2>
            <p class="text-base-content/60">This portal link is invalid, expired, or missing. Please contact PMG support for assistance.</p>
          </div>
        </div>
      </body>
      </html>
    `, 400);
  }

  const payload = verifyClientToken(token);

  if (!payload) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invalid Link | PMG Portal</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body class="bg-base-200 min-h-screen flex items-center justify-center">
        <div class="card w-96 bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-error"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            </div>
            <h2 class="card-title">Invalid or Expired Link</h2>
            <p class="text-base-content/60">This portal link has expired or is invalid. Please request a new link from PMG.</p>
          </div>
        </div>
      </body>
      </html>
    `, 401);
  }

  // Load board and tasks
  const board = await mondayService.getBoard(payload.boardId);
  if (!board) {
    return c.text("Board not found", 404);
  }

  const clientTasks = await mondayService.getClientInputTasks(payload.boardId);
  const progress = await mondayService.getClientProgress(payload.boardId);

  // Render client portal
  return c.html(`
    <!DOCTYPE html>
    <html lang="en" data-theme="light">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${board.name} - Client Portal | PMG</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script src="/js/htmx.min.js"></script>
    </head>
    <body class="bg-base-200 min-h-screen">
      <div class="max-w-3xl mx-auto p-4 lg:p-8">
        <!-- Header -->
        <div class="card bg-base-100 shadow-sm mb-6">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold">
                PM
              </div>
              <div>
                <h1 class="text-xl font-bold">${board.name}</h1>
                <p class="text-sm text-base-content/60">Perennial Management Group Client Portal</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div class="card bg-base-100 shadow-sm mb-6">
          <div class="card-body">
            <div class="flex items-center justify-between mb-2">
              <h2 class="font-semibold">Your Progress</h2>
              <span class="text-sm font-medium">${progress.completed} of ${progress.total} complete (${progress.percentage}%)</span>
            </div>
            <progress class="progress progress-primary w-full" value="${progress.percentage}" max="100"></progress>
          </div>
        </div>

        <!-- Task list -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">Tasks to Complete</h2>
            <div class="space-y-3">
              ${clientTasks.map(task => `
                <div class="flex items-center justify-between p-4 rounded-lg ${task.status === 'completed' ? 'bg-success/10' : 'bg-base-200'} border border-base-300">
                  <div class="flex items-center gap-3">
                    ${task.status === "completed" 
                      ? `<div class="w-8 h-8 rounded-full bg-success flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-success-content"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>`
                      : `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span class="text-primary font-bold text-sm">${clientTasks.indexOf(task) + 1}</span></div>`
                    }
                    <div>
                      <div class="font-medium ${task.status === 'completed' ? 'line-through text-base-content/50' : ''}">${task.name}</div>
                      ${task.status === "pending" ? '<span class="text-sm text-base-content/60">Click to complete this task</span>' : ''}
                      ${task.status === "in-progress" ? '<span class="text-sm text-warning">In progress</span>' : ''}
                      ${task.status === "completed" ? '<span class="text-sm text-success">Completed</span>' : ''}
                    </div>
                  </div>
                  ${task.status !== "completed" ? `
                    <button class="btn btn-primary btn-sm" hx-post="/portal/tasks/${task.id}/complete?token=${encodeURIComponent(token)}" hx-target="body" hx-swap="innerHTML">
                      Complete
                    </button>
                  ` : `
                    <span class="badge badge-success">Done</span>
                  `}
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-base-content/50">
          <p>Need help? Contact PMG support at support@perennialmg.com</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Complete a task from the client portal
portalRoutes.post("/tasks/:taskId/complete", async (c) => {
  const token = c.req.query("token");
  const taskId = c.req.param("taskId");

  if (!token) {
    return c.text("Token required", 401);
  }

  const payload = verifyClientToken(token);
  if (!payload) {
    return c.text("Invalid token", 401);
  }

  await mondayService.updateTaskStatus(taskId, "completed");

  // Re-render the portal page
  return c.redirect(`/portal?token=${encodeURIComponent(token)}`);
});

export default portalRoutes;
