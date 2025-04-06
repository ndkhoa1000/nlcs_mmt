import { ErrorCodeEnum } from "../enums/error-code.enums";
import MemberModel from "../models/member.model";
import organizationModel from "../models/organization.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from "../utils/appError";
import { Roles } from "../enums/roles.enums";
import { ObjectId } from "mongoose";

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

export const joinOrganizationWithInviteCodeService = async(userId: string, inviteCode: string) => {
    // Find the organization with the invite code
    const organization = await organizationModel.findOne({ inviteCode });
    if (!organization) {
        throw new NotFoundException("Invalid invite code or organization not found.");
    }

    // Check if user is already a member
    const existingMembership = await MemberModel.findOne({
        userId,
        orgId: organization._id
    });

    if (existingMembership) {
        throw new ConflictException("You are already a member of this organization.");
    }

    // Get the default member role
    const memberRole = await RoleModel.findOne({ name: Roles.MEMBER });
    if (!memberRole) {
        throw new NotFoundException("Member role not found in the system.");
    }

    // Create the membership
    const newMember = new MemberModel({
        userId,
        orgId: organization._id,
        role: memberRole._id,
        isApproved: true,  // Auto-approve when using invite code
        joinAt: new Date()
    });

    await newMember.save();

    // Update user's current organization if they don't have one set
    const user = await UserModel.findById(userId);
    if (user && !user.currentOrganization) {
        user.currentOrganization = organization._id as any;
        await user.save();
    }

    return { 
        member: newMember,
        organization
    };
};

// REVIEW: test changeMemberRole with Postman when finish joinOrg API(member)
export const changeOrganizationMemberRoleService = async(
    orgId: string, 
    memberId: string,
    roleId: string,
) => {
    const role = await RoleModel.findById(roleId);
    if(!role)
        throw new NotFoundException("Role not found.")
    
    const member = await MemberModel.findOne({userId:memberId, orgId:orgId})
    if(!member)
        throw new NotFoundException("Member not found.")

    member.role = role || member.role;
    await member.save();
    return {member}
}

export const banMemberFromOrganizationService = async(
    requesterId: string, 
    orgId: string, 
    memberId: string  // This is now the userId of the member to ban
) => {
    // Check if organization exists
    const organization = await organizationModel.findById(orgId);
    if (!organization) {
        throw new NotFoundException("Organization not found.");
    }

    // Verify the requester is the owner
    if (organization.owner.toString() !== requesterId) {
        throw new ForbiddenException("Only the organization owner can ban members.");
    }

    // Prevent banning yourself
    if (memberId === requesterId) {
        throw new BadRequestException("You cannot ban yourself from your own organization.");
    }

    // Find the member to ban using userId and orgId
    const memberToBan = await MemberModel.findOne({
        userId: memberId,
        orgId: orgId
    })
    .populate("userId", "name email")
    .populate("role", "name");
    
    if (!memberToBan) {
        throw new NotFoundException("Member not found in this organization.");
    }

    // If member's current organization is this one, set it to null
    const user = await UserModel.findById(memberId);
    if (user && user.currentOrganization?.toString() === orgId) {
        user.currentOrganization = null;
        await user.save();
    }

    // Delete the membership
    await memberToBan.deleteOne();

    return { 
        message: "Member banned successfully", 
        member: memberToBan 
    };
};

export const leaveOrganizationService = async(
    userId: string, 
    orgId: string
) => {
    // Check if organization exists
    const organization = await organizationModel.findById(orgId);
    if (!organization) {
        throw new NotFoundException("Organization not found.");
    }

    // Check if user is a member of this organization
    const membership = await MemberModel.findOne({ userId, orgId })
        .populate("role", "name");
    
    if (!membership) {
        throw new NotFoundException("You are not a member of this organization.");
    }

    // Check if user is the owner - owners can't leave their own organization
    if (organization.owner.toString() === userId) {
        throw new BadRequestException("As the owner, you cannot leave your organization. You must either delete it or transfer ownership first.");
    }

    // If this is user's current organization, find another organization
    const user = await UserModel.findById(userId);
    if (user && user.currentOrganization?.toString() === orgId) {
        // Find any other organization the user belongs to
        const otherMembership = await MemberModel.findOne({ 
            userId, 
            orgId: { $ne: orgId } 
        });
        
        user.currentOrganization = otherMembership ? otherMembership.orgId : null;
        await user.save();
    }

    // Delete the membership
    await membership.deleteOne();

    return { 
        message: "You have successfully left the organization", 
        organization: organization.name
    };
};