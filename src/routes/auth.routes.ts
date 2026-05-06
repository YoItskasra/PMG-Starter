import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";

const authRoutes = new Hono();

// Admin login form (for non-Basic Auth flow)
authRoutes.post("/admin/login", async (c) => {
  const { username, password } = await c.req.parseBody();

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pmg-admin-2024";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setCookie(c, "admin_session", "authenticated", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    // Redirect to admin dashboard
    c.header("HX-Redirect", "/admin");
    return c.html(`<div class="text-success">Login successful. Redirecting...</div>`);
  }

  c.status(401);
  return c.html(`
    <div class="alert alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Invalid username or password.</span>
    </div>
  `);
});

// Admin logout
authRoutes.get("/admin/logout", (c) => {
  deleteCookie(c, "admin_session", { path: "/" });
  return c.redirect("/admin");
});

export default authRoutes;
