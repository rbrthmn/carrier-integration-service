export class ShippingError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ShippingError';
    }
}

export class CarrierNotFoundError extends ShippingError {
    constructor(carrierCode: string) {
        super(`Carrier '${carrierCode}' is not registered`, 'CARRIER_NOT_FOUND');
        this.name = 'CarrierNotFoundError';
    }
}
