export const taskRowPartial = (data) => `
<div class="flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
  <div class="flex items-center gap-3">
    ${data.task.type === "client-input"
    ? `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span class="text-primary text-sm">✓</span></div>`
    : `<div class="w-8 h-8 rounded-full bg-neutral/10 flex items-center justify-center"><span class="text-neutral text-sm">🔒</span></div>`}
    <div>
      <div class="font-medium">${data.task.name}</div>
      <div class="flex items-center gap-2 mt-1">
        ${data.task.type === "client-input"
    ? `<span class="badge badge-primary badge-sm">Client Input</span>`
    : `<span class="badge badge-neutral badge-sm">Internal Only</span>`}
        ${data.task.status === "pending" ? `<span class="badge badge-ghost badge-sm">Pending</span>` : ""}
        ${data.task.status === "in-progress" ? `<span class="badge badge-warning badge-sm">In Progress</span>` : ""}
        ${data.task.status === "completed" ? `<span class="badge badge-success badge-sm">Completed</span>` : ""}
      </div>
    </div>
  </div>
  ${data.task.type === "client-input" ? `
    <button class="btn btn-sm ${data.task.status === "completed" ? "btn-success" : "btn-ghost"}" 
      ${data.task.status !== "completed" ? `hx-post="/admin/tasks/${data.task.id}/complete" hx-target="#task-list" hx-swap="innerHTML"` : ""}>
      ${data.task.status === "completed" ? "Done" : "Mark Done"}
    </button>
  ` : `
    <span class="text-sm text-base-content/50">Internal</span>
  `}
</div>
`;
export function renderTaskList(tasks) {
    return tasks.map((task) => taskRowPartial({ task })).join("");
}
//# sourceMappingURL=task-row.js.map