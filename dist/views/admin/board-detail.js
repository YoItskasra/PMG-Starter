const statusBadge = (status) => {
    const classes = {
        "Implementing": "badge-warning",
        "Onboarding": "badge-primary",
        "Active": "badge-success",
        "Inactive": "badge-ghost",
    };
    return `<span class="badge ${classes[status] || 'badge-ghost'}">${status}</span>`;
};
const taskTypeBadge = (type) => {
    if (type === "client-input") {
        return `<span class="badge badge-primary badge-sm">Client Input</span>`;
    }
    return `<span class="badge badge-neutral badge-sm">Internal Only</span>`;
};
const taskStatusIcon = (status) => {
    const icons = {
        "pending": `<span class="badge badge-ghost badge-sm">Pending</span>`,
        "in-progress": `<span class="badge badge-warning badge-sm">In Progress</span>`,
        "completed": `<span class="badge badge-success badge-sm">Completed</span>`,
    };
    return icons[status] || icons["pending"];
};
export const boardDetailView = (data) => `
<div class="space-y-6" id="board-detail">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <a href="/admin" class="text-sm text-base-content/60 hover:text-primary">← Back to Dashboard</a>
      </div>
      <h1 class="text-2xl font-bold">${data.board.name}</h1>
      <div class="flex items-center gap-2 mt-1">
        ${statusBadge(data.board.status)}
        <span class="text-sm text-base-content/60">Last updated: ${data.board.lastUpdated.toLocaleDateString()}</span>
      </div>
    </div>
    <div class="flex gap-2" id="board-actions">
      ${data.onboardingStarted && data.portalLink ? `
        <div class="join">
          <input type="text" class="input input-bordered join-item text-sm w-80" value="${data.portalLink}" readonly id="portal-link-input" />
          <button class="btn btn-primary join-item" onclick="navigator.clipboard.writeText(document.getElementById('portal-link-input').value); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);">
            Copy Link
          </button>
        </div>
      ` : `
        <button class="btn btn-primary" hx-post="/admin/onboarding/start" hx-vals='{"boardId": "${data.board.id}"}' hx-target="#board-actions" hx-swap="innerHTML">
          Start Onboarding
        </button>
      `}
    </div>
  </div>

  <!-- Progress bar -->
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold">Client Progress</h3>
        <span class="text-sm font-medium">${data.progress.completed} of ${data.progress.total} tasks complete (${data.progress.percentage}%)</span>
      </div>
      <progress class="progress progress-primary w-full" value="${data.progress.percentage}" max="100"></progress>
    </div>
  </div>

  <!-- Task list -->
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h2 class="card-title">Tasks</h2>
        <div class="flex gap-2">
          <span class="badge badge-primary badge-outline">Client Input</span>
          <span class="badge badge-neutral badge-outline">Internal Only</span>
        </div>
      </div>

      <div class="space-y-2" id="task-list" hx-get="/admin/boards/${data.board.id}/tasks" hx-trigger="every 10s" hx-swap="innerHTML">
        ${data.tasks.map(task => `
          <div class="flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
            <div class="flex items-center gap-3">
              ${task.type === "client-input"
    ? `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span class="text-primary text-sm">✓</span></div>`
    : `<div class="w-8 h-8 rounded-full bg-neutral/10 flex items-center justify-center"><span class="text-neutral text-sm">🔒</span></div>`}
              <div>
                <div class="font-medium">${task.name}</div>
                <div class="flex items-center gap-2 mt-1">
                  ${taskTypeBadge(task.type)}
                  ${taskStatusIcon(task.status)}
                </div>
              </div>
            </div>
            ${task.type === "client-input" ? `
              <button class="btn btn-sm ${task.status === "completed" ? "btn-success" : "btn-ghost"}" 
                ${task.status !== "completed" ? `hx-post="/admin/tasks/${task.id}/complete" hx-target="#task-list" hx-swap="innerHTML"` : ""}>
                ${task.status === "completed" ? "Done" : "Mark Done"}
              </button>
            ` : `
              <span class="text-sm text-base-content/50">Internal</span>
            `}
          </div>
        `).join("")}
      </div>
    </div>
  </div>

  <!-- Task Matching Preview -->
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <h2 class="card-title mb-4">Task Matching Preview</h2>
      <div class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Monday Task</th>
              <th>Portal Action</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Upload W-9</td><td>Document upload form</td><td><span class="badge badge-primary badge-sm">Client Input</span></td></tr>
            <tr><td>Sign engagement letter</td><td>E-signature workflow</td><td><span class="badge badge-primary badge-sm">Client Input</span></td></tr>
            <tr><td>Provide bank account info</td><td>Secure form (encrypted)</td><td><span class="badge badge-primary badge-sm">Client Input</span></td></tr>
            <tr><td>Answer payroll questions</td><td>Questionnaire wizard</td><td><span class="badge badge-primary badge-sm">Client Input</span></td></tr>
            <tr><td>Create Payroll Workspace</td><td>Auto-provisioned by PMG</td><td><span class="badge badge-neutral badge-sm">Internal Only</span></td></tr>
            <tr><td>Configure tax jurisdictions</td><td>Auto-configured by PMG</td><td><span class="badge badge-neutral badge-sm">Internal Only</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`;
//# sourceMappingURL=board-detail.js.map