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

export class AuthenticationError extends ShippingError {
    constructor(message: string) {
        super(message, 'AUTH_ERROR');
        this.name = 'AuthenticationError';
    }
}

export class CarrierAPIError extends ShippingError {
    constructor(
        message: string,
        public readonly carrier: string,
        public readonly httpStatus?: number,
        public readonly carrierErrorCode?: string
    ) {
        super(message, 'CARRIER_API_ERROR', { carrier, httpStatus, carrierErrorCode });
        this.name = 'CarrierAPIError';
    }
}

export class RateLimitError extends ShippingError {
    constructor(
        public readonly carrier: string,
        public readonly retryAfterSeconds?: number
    ) {
        super(`Rate limited by ${carrier}`, 'RATE_LIMITED', { retryAfterSeconds });
        this.name = 'RateLimitError';
    }
}

export class NetworkError extends ShippingError {
    constructor(message: string, public readonly isTimeout: boolean = false) {
        super(message, isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

export class ValidationError extends ShippingError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}
