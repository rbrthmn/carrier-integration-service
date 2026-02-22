import {RateRequest} from '../domain/models/rate-request';
import {CarrierNotFoundError} from '../domain/models/errors';
import {RateQuote} from "../domain";
import {getCarrier} from "../carriers/registry";
import {AxiosClient} from "../http/clients/axios-client";

export class ShippingService {

  /**
   * Fetches shipping rates from a specific carrier.
   * 
   * @param carrierCode - The unique identifier for the carrier (e.g., 'ups', 'fedex')
   * @param request - The domain-agnostic rate request details
   * @returns A promise resolving to an array of normalized rate quotes
   * @throws CarrierNotFoundError if the carrier is not registered
   * @throws ValidationError if the request data is invalid
   */
  async getRates(
    carrierCode: string,
    request: RateRequest
  ): Promise<RateQuote[]> {
    const client = new AxiosClient();
    const carrier = getCarrier(carrierCode, client);

    if (!carrier) {
      throw new CarrierNotFoundError(carrierCode);
    }

    return carrier.operations.getRates(request);
  }
}