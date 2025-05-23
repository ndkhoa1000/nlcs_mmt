import { z } from "zod";
import { 
    nameSchema, 
    phoneSchema, 
    addressSchema,
    dateSchema,
    objectIdSchema
} from "./common.validation";

export const updateUserSchema = z.object({
    name: nameSchema.optional(),
    profilePicture: z.string().trim().nullable().optional(),
    DateOfBirth: dateSchema,
    phoneNumber: phoneSchema,
    Address: addressSchema,
    Skills: z.string().trim().optional(),
    EmergencyContact: z.string().trim().optional(),
}).partial();
