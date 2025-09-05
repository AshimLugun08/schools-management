import { z } from 'zod';

export const schoolSchema = z.object({
  name: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(255, 'School name must be less than 255 characters'),
  
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be less than 100 characters'),
  
  contact: z.string()
    .regex(/^\d{10}$/, 'Contact must be a 10-digit number'),
  
  email_id: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  image: z.any()
    .refine((files) => files?.length >= 1, 'Image is required')
    .refine((files) => files?.[0]?.size <= 5000000, 'Max image size is 5MB')
    .refine(
      (files) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    )
});

export type SchoolFormData = z.infer<typeof schoolSchema>;