import { z } from "zod";
import { 
    nameSchema, 
    descriptionSchema,
    objectIdSchema,
    stringArraySchema,
    dateSchema
} from "./common.validation";
import { EventPriorityEnum, EventStatusEnum } from "../enums/event.enums";
import { eventCategories } from "../enums/eventCategories.enums";

export const createEventSchema = z.object({
    eventCode: z.string().trim().min(1),
    title: nameSchema,
    description: descriptionSchema.optional(),
    program: objectIdSchema,
    organization: objectIdSchema,
    category: z.array(z.nativeEnum(eventCategories)).optional(),
    location: z.string().trim().min(1),
    status: z.nativeEnum(EventStatusEnum).optional(),
    priority: z.nativeEnum(EventPriorityEnum).optional(),
    assignedTo: z.array(objectIdSchema).optional(),
    cohost: z.array(objectIdSchema).optional(),
    requiredVolunteer: z.number().int().nonnegative(),
    registrationDeadline: dateSchema,
    startTime: dateSchema,
    endTime: dateSchema,
    documents: stringArraySchema,
    needTraining: z.boolean().default(false)
});

export const updateEventSchema = createEventSchema.partial();

export const eventIdSchema = z.object({
    id: objectIdSchema
});