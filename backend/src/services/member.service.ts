import { ErrorCodeEnum } from "../enums/error-code.enums";
import MemberModel from "../models/member.model";
import organizationModel from "../models/organization.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";

export const getMemberRoleInWorkspaceService = async(userId: string, orgId: string) => {
    const organization = await organizationModel.findById(orgId);
    if(!organization) 
        throw new NotFoundException("Organization not found.");

    const member = await MemberModel.findOne({userId, orgId})
    .populate("role")
    .exec()

    if(!member)
        throw new UnauthorizedException(
    "You are not a member of this organization.",
    ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
    
    const roleName = member.role?.name;
    return {role: roleName };
}