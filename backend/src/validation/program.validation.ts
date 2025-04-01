import { z } from "zod";
import { 
    nameSchema, 
    descriptionSchema,
    objectIdSchema,
    stringArraySchema
} from "./common.validation";

export const createProgramSchema = z.object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    organization: objectIdSchema,
    documents: stringArraySchema
});

export const updateProgramSchema = createProgramSchema.partial();

export const programIdSchema = z.object({
    id: objectIdSchema
});