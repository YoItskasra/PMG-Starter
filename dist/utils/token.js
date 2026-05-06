import { createHmac, timingSafeEqual } from "crypto";
const LINK_TOKEN_SECRET = process.env.LINK_TOKEN_SECRET || "pmg-dev-secret-key-change-in-production";
/**
 * Generate a signed client token using HMAC-SHA256
 * Token format: base64(payload).base64(signature)
 */
export function generateClientToken(boardId, clientId) {
    const payload = {
        boardId,
        clientId,
        issuedAt: Math.floor(Date.now() / 1000),
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", LINK_TOKEN_SECRET).update(payloadB64).digest("base64url");
    return `${payloadB64}.${signature}`;
}
/**
 * Verify a client token signature and decode payload
 * Returns the decoded payload if valid, null if invalid
 */
export function verifyClientToken(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 2)
            return null;
        const [payloadB64, signature] = parts;
        // Recompute signature
        const expectedSignature = createHmac("sha256", LINK_TOKEN_SECRET).update(payloadB64).digest("base64url");
        // Constant-time comparison to prevent timing attacks
        const sigBuf = Buffer.from(signature, "base64url");
        const expectedBuf = Buffer.from(expectedSignature, "base64url");
        if (sigBuf.length !== expectedBuf.length)
            return null;
        if (!timingSafeEqual(sigBuf, expectedBuf))
            return null;
        // Decode payload
        const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
        const payload = JSON.parse(payloadJson);
        // Check expiration (30 days)
        const now = Math.floor(Date.now() / 1000);
        if (now - payload.issuedAt > 30 * 24 * 60 * 60)
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=token.js.map