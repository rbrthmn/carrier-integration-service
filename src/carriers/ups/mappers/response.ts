import { RateQuote } from "../../../domain";
import {UPSRateResponse} from "../operations/rating/ups-rating-response";

export function fromUPSRateResponse(
  upsResponse: UPSRateResponse
): RateQuote[] {
  return upsResponse.RateResponse.RatedShipment.map(rated => ({
    carrier: 'ups',
    serviceCode: rated.Service.Code || '',
    serviceName: rated.Service.Description || mapServiceCodeToName(rated.Service.Code || ''),
    totalPrice: {
      amount: parseFloat(rated.TotalCharges.MonetaryValue),
      currency: rated.TotalCharges.CurrencyCode
    },
    estimatedDelivery: rated.GuaranteedDelivery?.BusinessDaysInTransit
      ? addBusinessDays(new Date(), parseInt(rated.GuaranteedDelivery.BusinessDaysInTransit))
      : undefined,
    _raw: rated
  }));
}

function mapServiceCodeToName(code: string): string {
  const codes: Record<string, string> = {
    '01': 'UPS Next Day Air',
    '02': 'UPS Second Day Air',
    '03': 'UPS Ground',
    '07': 'UPS Worldwide Express',
    '08': 'UPS Worldwide Expedited',
    '11': 'UPS Standard',
    '12': 'UPS Three-Day Select',
    '13': 'UPS Next Day Air Saver',
    '14': 'UPS Next Day Air Early',
    '54': 'UPS Worldwide Express Plus',
    '59': 'UPS Second Day Air AM',
    '65': 'UPS Saver'
  };
  return codes[code] || `UPS Service ${code}`;
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      added++;
    }
  }
  return result;
}
