import { RateQuote } from "../../../../domain";
import { AuthClient } from "../../../../auth/auth-client";
import { RateRequest } from "../../../../domain/models/rate-request";
import {UPSConfig} from "../../ups-config";
import {HttpClient} from "../../../../http/client";
import {AuthenticationError, ShippingError} from "../../../../domain/models/errors";
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

  }
}
}