import {RateQuote} from "../domain";
import {RateRequest} from "../domain/models/rate-request";

export interface CarrierOperations {
    getRates(request: RateRequest): Promise<RateQuote[]>;
}
