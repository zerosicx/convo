/**
 * Authentication utilities for Convex functions
 */

/**
 * Get the authenticated user's ID from Clerk
 * Throws an error if the user is not authenticated
 */
export const getAuthenticatedUserId = async (ctx: any): Promise<string> => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject; // Clerk user ID
};

