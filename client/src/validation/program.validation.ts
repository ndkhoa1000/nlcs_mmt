import { z } from "zod";
import { 
    nameSchema, 
    descriptionSchema,
    stringArraySchema,
    dateSchema
} from "./common.validation";

export const createProgramSchema = z.object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    startDate: dateSchema,
    endDate: dateSchema,
    sponsors: stringArraySchema.optional(),
    documents: stringArraySchema.optional(),
});

export const updateProgramSchema = createProgramSchema.partial();

