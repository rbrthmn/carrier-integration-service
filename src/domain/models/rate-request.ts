import { AddressSchema } from "./address";
import { PackageSchema } from "./package";
import { z } from 'zod';

export const RateRequestSchema = z.object({
  origin: AddressSchema,
  destination: AddressSchema,
  packages: z.array(PackageSchema).min(1),
  // optional: request specific service level
  serviceCode: z.string().optional(),
  // optional: request by delivery date
  deliveryByDate: z.date().optional(),
});
 
export type RateRequest = z.infer<typeof RateRequestSchema>;
