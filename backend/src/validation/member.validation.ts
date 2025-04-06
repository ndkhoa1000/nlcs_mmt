import { z } from "zod";
import { objectIdSchema } from "./common.validation";

export const createMemberSchema = z.object({
    userId: objectIdSchema,
    orgId: objectIdSchema,
    role: objectIdSchema
});

export const updateMemberSchema =objectIdSchema;

// Updated validation to be more specific
export const inviteCodeSchema = z.object({
    inviteCode: z.string().trim().min(1, { message: "Invite code is required" })
});
