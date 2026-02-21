import {UPSCarrier} from "../../src/carriers/ups/ups-carrier";
import {RateRequest} from "../../src/domain/models/rate-request";
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {CarrierAPIError, ValidationError} from '../../src/domain/models/errors';
import {createMockHttpClient, errorResponse, successResponse, testConfig} from "../client-mock";

describe('UPS Rating Integration', () => {
  let carrier: UPSCarrier;
  let mockHttp: ReturnType<typeof createMockHttpClient>;

  const validRequest: RateRequest = {
    origin: {
      name: 'Sender Name',
      street1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US'
    },
    destination: {
      name: 'Receiver Name',
      street1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'US'
    },
    packages: [{
      weight: {value: 5, unit: 'LB'},
      dimensions: {length: 10, width: 8, height: 6, unit: 'IN'},
      packagingType: "PACKAGE"
    }]
  };

  beforeEach(() => {
    mockHttp = createMockHttpClient();
    carrier = new UPSCarrier(testConfig, mockHttp);

    // default: auth succeeds
    mockHttp.onPost('/oauth/token').reply(200, {
      access_token: 'test-token-123',
      expires_in: 3600
    });
  });

  describe('successful rate requests', () => {
    it('should return normalized rate quotes', async () => {
      mockHttp.onPost('/rating').reply(200, successResponse);

      const quotes = await carrier.operations.getRates(validRequest);

      expect(quotes).toHaveLength(1);
      expect(quotes[0]).toMatchObject({
        carrier: 'ups',
        serviceCode: expect.any(String),
        serviceName: expect.any(String),
        totalPrice: {
          amount: expect.any(Number),
          currency: 'USD'
        }
      });
    });

    it('should correctly map request to UPS format', async () => {
      mockHttp.onPost('/rating').reply(200, successResponse);

      await carrier.operations.getRates(validRequest);

      const ratingCall = mockHttp.history.post.find(req => req.url === '/rating');
      const payload = typeof ratingCall.data === 'string'
        ? JSON.parse(ratingCall.data) 
        : ratingCall.data;
      expect(payload.RateRequest.Shipment.Shipper.Address.PostalCode)
        .toBe('10001');
      expect(payload.RateRequest.Shipment.Package).toBeDefined();
    });
  });

  describe('authentication lifecycle', () => {
    it('should reuse cached token for multiple requests', async () => {
      mockHttp.onPost('/rating').reply(200, successResponse);

      await carrier.operations.getRates(validRequest);
      await carrier.operations.getRates(validRequest);

      const tokenCalls = mockHttp.history.post.filter(
        req => req.url?.includes('oauth')
      );
      expect(tokenCalls).toHaveLength(1);
    });

    it('should refresh token when expired', async () => {
      vi.useFakeTimers();
      mockHttp.onPost('/oauth/token').replyOnce(200, {
        access_token: 'token-1',
        expires_in: 3600
      });
      mockHttp.onPost('/oauth/token').replyOnce(200, {
        access_token: 'token-2',
        expires_in: 3600
      });
      mockHttp.onPost('/rating').reply(200, successResponse);
      await carrier.operations.getRates(validRequest);
      vi.advanceTimersByTime(2 * 60 * 60 * 1000);
      await carrier.operations.getRates(validRequest);

      const tokenCalls = mockHttp.history.post.filter(
        req => req.url?.includes('oauth')
      );
      
      expect(tokenCalls).toHaveLength(2);
      expect(tokenCalls[0].data).toContain('grant_type=client_credentials');
      
      vi.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('should throw CarrierAPIError on UPS error response', async () => {
      mockHttp.onPost('/rating').reply(400, errorResponse);

      expect(carrier.operations.getRates(validRequest))
          .rejects.toThrow(CarrierAPIError);
    });

    it('should throw ValidationError for invalid input', async () => {
      const badRequest = { ...validRequest, origin: { ...validRequest.origin, postalCode: '' } };

     expect(carrier.operations.getRates(badRequest as RateRequest))
         .rejects.toThrow(ValidationError);
    });

    it('should handle network timeouts gracefully', async () => {
      mockHttp.onPost('/rating').timeout();

      expect(carrier.operations.getRates(validRequest))
          .rejects.toMatchObject({
        name: 'NetworkError',
        code: 'TIMEOUT'
      });
    });

    it('should handle rate limiting with retry-after', async () => {
      mockHttp.onPost('/rating').reply(429, {}, { 'retry-after': '120' });

      const error = await carrier.operations.getRates(validRequest)
        .catch(e => e);

      expect(error.name).toBe('RateLimitError');
      expect(error.retryAfterSeconds).toBe(120);
    });
  });
});
