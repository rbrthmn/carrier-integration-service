import { z } from 'zod';

export const PackageSchema = z.object({
  weight: z.object({
    value: z.number().positive(),
    unit: z.enum(['LB', 'KG']).default('LB')
  }),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
    unit: z.enum(['IN', 'CM']).default('IN')
  }).optional(),
  packagingType: z.enum(['PACKAGE', 'LETTER', 'TUBE']).default('PACKAGE'),
});
 
export type Package = z.infer<typeof PackageSchema>;
