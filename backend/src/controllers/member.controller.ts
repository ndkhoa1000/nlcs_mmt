import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { inviteCodeSchema } from "../validation/member.validation";
import { objectIdSchema } from "../validation/common.validation";
import { banMemberFromOrganizationService, changeOrganizationMemberRoleService, getMemberRoleInWorkspaceService, joinOrganizationWithInviteCodeService, leaveOrganizationService } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roles.enums";
import { changeRoleSchema } from "../validation/organization.validation";

export const joinOrganizationController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const { inviteCode } = inviteCodeSchema.parse(req.body);

        const { member, organization } = await joinOrganizationWithInviteCodeService(userId, inviteCode);
        
        return res.status(HTTPSTATUS.OK).json({
            message: `You have successfully joined ${organization.name}`,
            member
        });
    }
);

export const changeOrganizationMemberRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.id);
        // memberId is USER_ID of this member
        const { memberId, roleId } = changeRoleSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { member } = await changeOrganizationMemberRoleService(orgId, memberId, roleId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Member's role updated successfully",
            member
        });
    }
);

export const banMemberController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const memberId = objectIdSchema.parse(req.params.id);
        
        const result = await banMemberFromOrganizationService(userId, orgId, memberId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Member banned successfully",
            bannedMember: result.member
        });
    }
);

export const leaveOrganizationController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        
        const result = await leaveOrganizationService(userId, orgId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: `You have successfully left the organization: ${result.organization}`,
            result
        });
    }
);
