import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";

import { objectIdSchema } from "../validation/common.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roles.enums";
import { createProgramSchema, updateProgramSchema } from "../validation/program.validation";
import { createProgramService, deleteProgramByIdService, getAllProgramsService, getProgramAnalyticsService, getProgramByIdService, updateProgramByIdService } from "../services/program.service";

export const createProgramController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = String(req.params.orgId);
        const body = createProgramSchema.parse({ ...req.body });

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.CREATE_PROGRAM]);

        const { program } = await createProgramService(userId, orgId, body);
        return res.status(HTTPSTATUS.OK).json({
            message: "Program created.",
            program,
        });
    }
);

export const getAllProgramsController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = String(req.params.orgId);

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const {programs} = await getAllProgramsService(userId, orgId);
        return res.status(HTTPSTATUS.OK).json({
            message: "fetch all programs. successfully.",
            programs
        });
    }
);

export const getProgramByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);         
        const programId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const {program} = await getProgramByIdService(orgId, programId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Program fetch successfully.",
            program
        });
    }
);

export const updateProgramByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);         
        const programId = objectIdSchema.parse(req.params.id);
        const body = updateProgramSchema.parse({...req.body});

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.EDIT_PROGRAM]);
        
        const {program} = await updateProgramByIdService(orgId, programId, body);

        return res.status(HTTPSTATUS.OK).json({
            message: "Program updated.",
            program
        });
    }
);

export const getProgramAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const programId = objectIdSchema.parse(req.params.id);
       
        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const {analysis} = await getProgramAnalyticsService(orgId, programId);

        return res.status(HTTPSTATUS.OK).json({
            message: "fetch analysis successfully.",
            analysis
        });
    }
);

export const deleteProgramByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const programId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.DELETE_PROGRAM]);

        const {program} = await deleteProgramByIdService(orgId, programId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Program deleted.",
            program
        });
    }
);