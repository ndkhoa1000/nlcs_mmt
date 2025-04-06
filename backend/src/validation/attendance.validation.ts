import { z } from "zod";
import { objectIdSchema, dateSchema } from "./common.validation";

export const createAttendanceSchema = z.object({
    isPresent: z.boolean().default(false),
    checkInTime: dateSchema.default(() => new Date()).optional(),
    checkOutTime: dateSchema.optional(),
    hoursContributed: z.number().nonnegative().optional().default(0),
});

export const updateAttendanceSchema = z.object({
    isPresent: z.boolean(),
    checkInTime: dateSchema.default(() => new Date()),
    checkOutTime: dateSchema,
    hoursContributed: z.number().nonnegative(),
    feedback: z.string().trim()
}).partial();

