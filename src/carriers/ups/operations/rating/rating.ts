import {RateQuote} from "../../../../domain";
import {AuthClient} from "../../../../auth/auth-client";
import {RateRequest} from "../../../../domain/models/rate-request";
import {UPSConfig} from "../../ups-config";
import {HttpClient} from "../../../../http/client";
import {
  AuthenticationError,
  CarrierAPIError,
  NetworkError,
  RateLimitError,
  ShippingError
} from "../../../../domain/models/errors";
import {toUPSRateRequest} from "../../mappers/request";
import {fromUPSRateResponse} from "../../mappers/response";
import {UPSRateRequest} from "./ups-rating-request";
import {UPSRateResponse} from "./ups-rating-response";

export class UPSRatingOperation {
      
  constructor(
    private readonly config: UPSConfig,
    private readonly authClient: AuthClient,
    private readonly httpClient: HttpClient
  ) {
  }

  async execute(request: RateRequest): Promise<RateQuote[]> {
    const upsRequest = toUPSRateRequest(request);
    return this.executeRequest(upsRequest);
  }

  private async executeRequest(request: UPSRateRequest): Promise<RateQuote[]> {
  try {
    const token = await this.authClient.getAccessToken();
    
    const response = await this.httpClient.post<UPSRateResponse>(
      this.config.ratingUrl,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );
    
    return fromUPSRateResponse(response);

  } catch (error) {
    // handle Axios/HTTP errors
    if (this.isHttpError(error)) {
      const status = error.response?.status;
      const body = error.response?.data;

      if (status === 401) {
        this.authClient.clearCache();
        throw new AuthenticationError('UPS authentication failed - token may be invalid');
      }

      if (status === 429) {
        const retryAfter = parseInt(error.response?.headers?.['retry-after'] || '60', 10);
        throw new RateLimitError('ups', retryAfter);
      }

      if (body?.response?.errors) {
        const upsError = body.response.errors[0];
        throw new CarrierAPIError(
          upsError.message || 'UPS API error',
          'ups',
          status,
          upsError.code
        );
      }

      throw new CarrierAPIError(
        `UPS API returned status ${status}`,
        'ups',
        status
      );
    }

    if (this.isTimeoutError(error)) {
      throw new NetworkError('UPS API request timed out', true);
    }

    if (this.isNetworkError(error)) {
      throw new NetworkError('Failed to connect to UPS API');
    }

    throw new ShippingError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      { originalError: String(error) }
    );
  }
}

  private isHttpError(error: any): error is any {
    return error && typeof error === 'object' && 'response' in error;
  }

  private isTimeoutError(error: any): boolean {
    return error && (error.code === 'ECONNABORTED' || error.message?.includes('timeout'));
  }

  private isNetworkError(error: any): boolean {
    return error && (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error'));
  }
}