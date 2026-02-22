# Carrier Integration Service

A TypeScript service for integrating with shipping carriers (UPS, FedEx, USPS)
to fetch shipping rates, purchase labels, and track shipments.

## Architecture

### Design Decisions

**1. Carrier Abstraction**
Each carrier implements the `Carrier` interface, ensuring consistent behavior
across UPS, FedEx, etc. New carriers can be added without modifying existing code.

**2. Domain Isolation**
Internal domain models (`RateRequest`, `RateQuote`) are completely independent
of any carrier's API format. Mappers translate between domain and API shapes.

**3. OAuth Token Lifecycle**
Tokens are cached and automatically refreshed before expiry. The caller never
needs to think about authentication.

**4. Structured Errors**
All errors are typed (`ValidationError`, `CarrierAPIError`, etc.) with
consistent structure. No raw strings or generic errors.

### How to Add a New Carrier

1. Create a new folder: `src/carriers/fedex/`
2. Implement the `Carrier` interface
3. Create mappers for request/response translation
4. Register in `src/carriers/fedex/index.ts`

## Getting Started

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run build
npm test
```

## Usage

```typescript
import { ShippingService } from './src';

const service = new ShippingService();

const quotes = await service.getRates('ups', {
origin: { /* address */ },
destination: { /* address */ },
packages: [{ weight: { value: 5, unit: 'LB' } }]
});
```

## Running Tests

```bash
npm test              # Run all tests
npm run test:coverage # Run coverage
```

## What I Would Improve Given More Time

1. **Retry Logic**: Add exponential backoff for transient failures
2. **Caching**: Cache rate quotes for identical requests (short TTL)
3. **Observability**: Add structured logging and metrics
4. **Rate Limiting**: Implement client-side rate limiting to avoid 429s
5. **Additional Operations**: Label purchase, tracking, address validation
6. **Additional Carriers**: FedEx, USPS, DHL implementations
7. **Unit Tests**: Unit tests for mappers and validation

## Environment Variables

See `.env.example` for required configuration.
