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
    address: addressSchema,
    phoneNumber: phoneSchema,
    description: descriptionSchema.optional(),
    mission: z.string().trim().optional(),
    logo: urlSchema.optional(),
    email: emailSchema.optional(),
    website: urlSchema.optional(),
    socialMediaLink: stringArraySchema.optional(),
    establishedDate: dateSchema.optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const changeRoleSchema = z.object({
    memberId: objectIdSchema,
    roleId: objectIdSchema,
});