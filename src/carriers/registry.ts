import {HttpClient} from "../http/client";
import {Carrier} from "./carrier";
import {CarrierNotFoundError} from "../domain/models/errors";

type CarrierFactory = (httpClient: HttpClient) => Carrier;

const carrierFactories: Map<string, CarrierFactory> = new Map();

export function registerCarrier(code: string, factory: CarrierFactory): void {
    carrierFactories.set(code, factory);
}

export function getCarrier(code: string, httpClient: HttpClient): Carrier {
    const factory = carrierFactories.get(code);
    if (!factory) {
        throw new CarrierNotFoundError(code);
    }
    return factory(httpClient);
}
