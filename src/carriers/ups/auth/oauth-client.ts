import { AuthClient } from "../../../auth/auth-client";
import { TokenData } from "../../../auth/token-data";
import {HttpClient} from "../../../http/client";
import {AuthenticationError} from "../../../domain/models/errors";
import {UPSConfig} from "../config";

interface UPSTokenResponse {
  access_token: string;
  expires_in: number;
}

export class UPSOAuthClient implements AuthClient {
  private tokenCache: TokenData | null = null;
  
  constructor(
    private readonly config: UPSConfig,
    private readonly httpClient: HttpClient
  ) {}
  
  /**
   * Get a valid access token, refreshing if needed. 
   * Token is cached and reused until ~60 seconds before expiry.
   */
  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.tokenCache!.accessToken;
    }
    
    await this.refreshToken();
    return this.tokenCache!.accessToken;
  }
  
  private isTokenValid(): boolean {
    if (!this.tokenCache) return false;
    
    // refresh 60 seconds before actual expiry to avoid race conditions
    const bufferMs = 60 * 1000;
    return this.tokenCache.expiresAt.getTime() > Date.now() + bufferMs;
  }
  
  private async refreshToken(): Promise<void> {
    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString('base64');
    
    try {
      const response = await this.httpClient.post<UPSTokenResponse>(
        this.config.tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      
      this.tokenCache = {
        accessToken: response.access_token,
        expiresAt: new Date(Date.now() + response.expires_in * 1000)
      };
    } catch (error) {
      throw new AuthenticationError('Failed to obtain UPS access token');
    }
  }
  
  clearCache(): void {
    this.tokenCache = null;
  }
}
