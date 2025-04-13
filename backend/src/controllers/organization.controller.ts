import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { createOrganizationSchema, updateOrganizationSchema } from "../validation/organization.validation";
import { 
    createOrganizationService, 
    deleteOrganizationByIdService, 
    getAllOrganizationsUserIsMemberService,
    getOrganizationAnalyticsService, 
    getOrganizationByIdService, 
    getOrganizationMembersService, 
    updateOrganizationByIdService } 
    from "../services/organization.service";
import {getMemberRoleInWorkspaceService} from "../services/member.service";
    import { objectIdSchema } from "../validation/common.validation";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roles.enums";


export const createOrganizationController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createOrganizationSchema.parse({ ...req.body });
        const userId = String(req.user?._id);
        const { organization } = await createOrganizationService(userId, body);
        return res.status(HTTPSTATUS.OK).json({
            message: "Organization created.",
            organization,
        });
    }
);

export const getAllOrganizationsUserIsMemberController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);

        const {organizations} = await getAllOrganizationsUserIsMemberService(userId);
        return res.status(HTTPSTATUS.OK).json({
            message: "All organization of current user.",
            organizations
        });
    }
);

export const getOrganizationByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const {organization} = await getOrganizationByIdService(orgId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Organization fetch successfully.",
            organization
        });
    }
);
export const getOrganizationMembersController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const {members, roles} = await getOrganizationMembersService(orgId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization members fetched successfully",
            members,
            roles,
        });
    }
);
export const updateOrganizationByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.id);
        const body = updateOrganizationSchema.parse({...req.body});
        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.EDIT_ORGANIZATION]);

        const {organization} = await updateOrganizationByIdService(userId, orgId, body);

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
            organization
        });
    }
);

export const getOrganizationAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.id);
       
        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const {analysis} = await getOrganizationAnalyticsService(userId, orgId);

        return res.status(HTTPSTATUS.OK).json({
            message: "fetch analysis successfully.",
            analysis
        });
    }
);


// REVIEW: delete Org will delete everything related to Org, finish other models to perform fully delete.
export const deleteOrganizationByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId,orgId);
        roleGuard(role, [Permissions.DELETE_ORGANIZATION]);

        const {currentOrgId} = await deleteOrganizationByIdService(userId, orgId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Organization deleted.",
            currentOrgId
        });
    }
);

