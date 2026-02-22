export interface AuthClient {
  getAccessToken(): Promise<string>;
  clearCache(): void;
}
