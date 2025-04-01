import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { createOrganizationSchema } from "../validation/organization.validation";
import { createOrganizationService, getAllOrganizationsUserIsMemberService } from "../services/organization.service";

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
        const body = createOrganizationSchema.parse({ ...req.body });

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
        });
    }
);
export const updateOrganizationByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        // const body

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
        });
    }
);
export const changeOrganizationMemberRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        // const body

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
        });
    }
);
export const deleteOrganizationByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        // const body

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
        });
    }
);
export const getOrganizationMembersController = asyncHandler(
    async (req: Request, res: Response) => {
        // const body

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
        });
    }
);
export const getOrganizationAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        // const body

        return res.status(HTTPSTATUS.OK).json({
            message: "Organization updated.",
        });
    }
);
