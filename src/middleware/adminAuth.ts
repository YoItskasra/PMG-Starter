import { createMiddleware } from "hono/factory";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pmg-admin-2024";

export interface AdminAuthVariables {
  isAdmin: boolean;
}

/**
 * Parse Basic Auth header and validate credentials
 */
function validateBasicAuth(authHeader: string | undefined): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  const credentials = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

/**
 * Middleware to protect admin routes
 * Supports both Basic Auth and session-based auth via cookie
 */
export const adminAuth = createMiddleware<{ Variables: AdminAuthVariables }>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const sessionToken = getCookie(c, "admin_session");

  // Check session cookie first
  if (sessionToken === "authenticated") {
    c.set("isAdmin", true);
    return next();
  }

  // Then check basic auth
  if (validateBasicAuth(authHeader)) {
    c.set("isAdmin", true);
    // Set session cookie for subsequent requests
    setCookie(c, "admin_session", "authenticated", {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "Strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return next();
  }

  // For HTMX requests, return a 401 with a login form partial
  const isHtmx = c.req.header("HX-Request") === "true";

  if (isHtmx) {
    c.status(401);
    return c.html(`
      <div class="flex items-center justify-center min-h-screen bg-base-200">
        <div class="card w-96 bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Admin Login</h2>
            <p class="text-error">Invalid credentials. Please try again.</p>
            <form hx-post="/auth/admin/login" hx-target="#admin-content" hx-swap="innerHTML" class="space-y-4">
              <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/></svg>
                <input type="text" name="username" class="grow" placeholder="Username" required />
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" clip-rule="evenodd"/></svg>
                <input type="password" name="password" class="grow" placeholder="Password" required />
              </label>
              <button type="submit" class="btn btn-primary w-full">Login</button>
            </form>
          </div>
        </div>
      </div>
    `);
  }

  // For regular requests, return 401 with WWW-Authenticate header
  c.header("WWW-Authenticate", 'Basic realm="PMG Admin"');
  return c.text("Unauthorized", 401);
});

/**
 * Check if request is authenticated (for use in route handlers)
 */
export function isAdminAuthenticated(c: any): boolean {
  const authHeader = c.req.header("Authorization");
  const sessionToken = getCookie(c, "admin_session");
  return sessionToken === "authenticated" || validateBasicAuth(authHeader);
}
