import { z } from "zod";
import { objectIdSchema } from "./common.validation";

export const createMemberSchema = z.object({
    userId: objectIdSchema,
    orgId: objectIdSchema,
    role: objectIdSchema
});

export const updateMemberSchema = z.object({
    role: objectIdSchema
});

export const inviteCodeSchema = z.object({
    inviteCode: z.string().trim().min(1, { message: "Invite code is required" })
});

export const memberIdSchema = z.object({
    id: objectIdSchema
});