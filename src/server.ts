import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import portalRoutes from "./routes/portal.routes";

const app = new Hono();

// Serve static files
app.use("/css/*", serveStatic({ root: "./public" }));
app.use("/js/*", serveStatic({ root: "./public" }));

// Routes
app.route("/auth", authRoutes);
app.route("/admin", adminRoutes);
app.route("/portal", portalRoutes);

// Home redirect
app.get("/", (c) => c.redirect("/admin"));

// Health check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

const port = parseInt(process.env.PORT || "3000");

serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 PMG Portal server running at http://localhost:${port}`);
console.log(`📊 Admin Dashboard: http://localhost:${port}/admin`);
console.log(`🔑 Default admin credentials: admin / pmg-admin-2024`);
