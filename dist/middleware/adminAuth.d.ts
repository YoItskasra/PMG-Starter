export interface AdminAuthVariables {
    isAdmin: boolean;
}
/**
 * Middleware to protect admin routes
 * Supports both Basic Auth and session-based auth via cookie
 */
export declare const adminAuth: import("hono").MiddlewareHandler<{
    Variables: AdminAuthVariables;
}, string, {}, Response>;
/**
 * Check if request is authenticated (for use in route handlers)
 */
export declare function isAdminAuthenticated(c: any): boolean;
//# sourceMappingURL=adminAuth.d.ts.map