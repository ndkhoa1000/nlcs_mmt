import { z } from "zod";
import { objectIdSchema, dateSchema } from "./common.validation";

export const createAttendanceSchema = z.object({
    eventId: objectIdSchema,
    userId: objectIdSchema,
    isPresent: z.boolean().default(true),
    checkInTime: dateSchema.default(() => new Date()),
    checkOutTime: dateSchema,
    hoursContributed: z.number().nonnegative().optional(),
    feedback: z.string().trim().optional()
});

export const updateAttendanceSchema = z.object({
    isPresent: z.boolean().optional(),
    checkOutTime: dateSchema,
    hoursContributed: z.number().nonnegative().optional(),
    feedback: z.string().trim().optional()
});

export const attendanceIdSchema = z.object({
    id: objectIdSchema
});