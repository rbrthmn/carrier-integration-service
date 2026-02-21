import { z } from 'zod';
 
export const AddressSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  street1: z.string().min(1),
  street2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().length(2),
  postalCode: z.string().min(5),
  country: z.string().length(2).default('US'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type Address = z.infer<typeof AddressSchema>;