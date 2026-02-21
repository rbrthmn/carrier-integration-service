export interface UPSConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  ratingUrl: string;
}

export function loadUPSConfig(): UPSConfig {
  return {
    clientId: process.env.UPS_CLIENT_ID || '',
    clientSecret: process.env.UPS_CLIENT_SECRET || '',
    tokenUrl: process.env.UPS_TOKEN_URL || 'https://wwwcie.ups.com/security/v1/oauth/token',
    ratingUrl: process.env.UPS_RATING_URL || 'https://wwwcie.ups.com/api/rating/v1'
  };
}
