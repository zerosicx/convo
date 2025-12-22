/**
 * Convex Auth Configuration for Clerk
 * 
 * This configures Convex to verify JWTs issued by Clerk.
 * The domain is your Clerk Frontend API URL from the JWT template.
 */
export default {
  providers: [
    {
      // Clerk issuer domain from your "convex" JWT template
      domain: "https://glad-gar-11.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

