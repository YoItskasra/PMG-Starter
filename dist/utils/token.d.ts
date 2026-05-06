export interface ClientTokenPayload {
    boardId: string;
    clientId: string;
    issuedAt: number;
}
/**
 * Generate a signed client token using HMAC-SHA256
 * Token format: base64(payload).base64(signature)
 */
export declare function generateClientToken(boardId: string, clientId: string): string;
/**
 * Verify a client token signature and decode payload
 * Returns the decoded payload if valid, null if invalid
 */
export declare function verifyClientToken(token: string): ClientTokenPayload | null;
//# sourceMappingURL=token.d.ts.map