export interface Money {
  amount: number;
  currency: string;
}
 
export interface RateQuote {
  carrier: string;
  serviceCode: string;
  serviceName: string;
  totalPrice: Money;
  estimatedDelivery?: Date;
  _raw?: unknown;
}
