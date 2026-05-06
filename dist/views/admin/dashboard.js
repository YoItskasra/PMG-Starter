export const dashboardView = (data) => `
<div class="space-y-6">
  <!-- Page header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-base-content/60">Overview of all client onboarding activities</p>
    </div>
  </div>

  <!-- Stats cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="stat bg-base-100 rounded-box shadow-sm">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
      </div>
      <div class="stat-title">Total Clients</div>
      <div class="stat-value text-primary">${data.totalClients}</div>
      <div class="stat-desc">All time</div>
    </div>

    <div class="stat bg-base-100 rounded-box shadow-sm">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
      </div>
      <div class="stat-title">Active Onboardings</div>
      <div class="stat-value text-secondary">${data.activeOnboardings}</div>
      <div class="stat-desc">In progress now</div>
    </div>

    <div class="stat bg-base-100 rounded-box shadow-sm">
      <div class="stat-figure text-warning">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
      </div>
      <div class="stat-title">Tasks Pending Client</div>
      <div class="stat-value text-warning">${data.pendingClientTasks}</div>
      <div class="stat-desc">Waiting on action</div>
    </div>

    <div class="stat bg-base-100 rounded-box shadow-sm">
      <div class="stat-figure text-success">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
      </div>
      <div class="stat-title">Completed This Week</div>
      <div class="stat-value text-success">${data.completedThisWeek}</div>
      <div class="stat-desc">Tasks finished</div>
    </div>
  </div>

  <!-- Client boards table -->
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h2 class="card-title">Client Boards</h2>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-ghost" hx-get="/admin/boards" hx-target="#boards-table-body" hx-swap="innerHTML">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
            Refresh
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Board Status</th>
              <th>Tasks</th>
              <th>Progress</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="boards-table-body" hx-get="/admin/boards" hx-trigger="load" hx-swap="innerHTML">
            <!-- Loaded via HTMX -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`;
//# sourceMappingURL=dashboard.js.map