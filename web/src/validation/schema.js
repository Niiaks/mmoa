import * as z from "zod";

const registrationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const createCampaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  targetAmount: z.number().positive("amount must be positive"),
  deadline: z.iso.datetime().transform(str => new Date(str)).refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  }).optional(),
  requireContributorName: z.boolean()
});

const extendCampaignSchema = z.object({
  deadline: z.iso.datetime().transform(str => new Date(str)).refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  })
});

const contributeToCampaignSchema = z.object({
  name: z.string().optional(),
  email: z.email("invalid email"),
  amount: z.number().positive("amount must be positive"),
});

const withdrawFromCampaignSchema = z.object({
  momoNumber: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const schemas = {
  registrationSchema,
  loginSchema,
  createCampaignSchema,
  extendCampaignSchema,
  contributeToCampaignSchema,
  withdrawFromCampaignSchema,
};