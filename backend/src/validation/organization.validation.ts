import { z } from "zod";
import { 
    nameSchema, 
    descriptionSchema, 
    emailSchema, 
    phoneSchema, 
    addressSchema,
    urlSchema,
    dateSchema,
    stringArraySchema,
    objectIdSchema
} from "./common.validation";

export const createOrganizationSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    mission: z.string().trim().optional(),
    address: addressSchema.optional(),
    phoneNumber: phoneSchema,
    email: emailSchema.optional(),
    website: urlSchema,
    socialMediaLink: stringArraySchema,
    establishedDate: dateSchema
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const organizationIdSchema = z.object({
    id: objectIdSchema
});

export const changeRoleSchema = z.object({
    userId: objectIdSchema,
    roleId: objectIdSchema
});