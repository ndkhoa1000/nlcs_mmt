
import mongoose from "mongoose";
import OrganizationModel from "../models/organization.model";
import {BadRequestException, ConflictException, NotFoundException } from "../utils/appError";
import UserModel from "../models/user.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/roles.enums";
import MemberModel from "../models/member.model";
import ProgramModel from "../models/program.model";
import EventModel from "../models/event.model";
import AttendanceModel from "../models/attendance.model";
import { EventStatusEnum } from "../enums/event.enums";

// NOTE: may not need transaction for simple service.
export const createOrganizationService = async(
    userId: string, 
    body :{
        name: string,
        address: string,
        phoneNumber: string,
        description?: string | null,
        mission?: string | null,
        logo?:string |null,
        email?: string | null,
        website?: string | null,
        socialMediaLink?: string[] | null,
        establishedDate?: Date | null,
}) => {
    const {name,address,phoneNumber,description,mission,logo,email,website,socialMediaLink, establishedDate} = body;
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('[createOrganizationService]: Start session...');
    try {
        let user = await UserModel.findById(userId).session(session);
        if (!user)
            throw new NotFoundException("User not found.");
        
        let ownerRole = await RoleModel.findOne({name: Roles.OWNER});
        if (!ownerRole)
            throw new NotFoundException("OWNER role not found.");

        let organization = await OrganizationModel.findOne({name}).session(session);
        if(!organization){
            organization = new OrganizationModel({
                name,
                address,
                phoneNumber,
                description,
                mission,
                logo,
                email,
                website,
                socialMediaLink,
                isVerified: true, //NOTE: only for simplify Web App, need Verify feature
                establishedDate,
                owner: userId
            });
            
            await organization.save({session});

            let member = new MemberModel({
                userId,
                orgId: organization._id,
                role: ownerRole,
            })

            await member.save({session});
            
            // update user's current org
            user.currentOrganization = organization ? 
            (organization._id as mongoose.Types.ObjectId) : user.currentOrganization;
            await user.save({session});
            
            await session.commitTransaction();
                console.log('[createOrganizationService]: commit transaction...');
                session.endSession();
                console.log('[createOrganizationService]: session end. Finish.');
    
                return {organization};
        }else{
            throw new ConflictException("Organization name has been taken. Please try another name!");
        }
    } catch (error) {
        console.log("Error during session...", error)
        await session.abortTransaction()
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
}

export const getAllOrganizationsUserIsMemberService = async(userId: string) => {
    const memberships = await MemberModel.find({userId})
    .populate("orgId")
    .select("-password")
    .exec();
    // extract org from member 
    const organizations = memberships.map((membership) => membership.orgId);

    return {organizations};
};

export const getOrganizationByIdService = async (orgId: string) => {
    const organization = await OrganizationModel.findById(orgId)

    if (!organization)
        throw new NotFoundException("Organization not found.");

    //NOTE: return org and its member
    const member = await MemberModel.find({orgId})
    .populate("role")
    .exec();
    const organizationWithMember = {...organization.toObject(), member};
    
    return {organization: organizationWithMember};
}   

export const getOrganizationMembersService = async (orgId: string) => {
    //NOTE: fetch all member from the organization

    const members = MemberModel.find({orgId})
    .populate("userId", "name email profilePicture -password")
    .populate("role", "name");

    const roles = RoleModel.find({}, {name:1, _id:1})
    .select("-permission")
    .lean();

    return {members, roles};
}

export const updateOrganizationByIdService = async (
    userId: string, 
    orgId: string,
    body :{
        name?: string | null,
        address?: string | null,
        phoneNumber?: string | null,
        description?: string | null,
        mission?: string | null,
        logo?:string |null,
        email?: string | null,
        website?: string | null,
        socialMediaLink?: string[] | null,
        establishedDate?: Date | null,
}) => {
    const {name, address, phoneNumber,description,mission,logo,email,website,socialMediaLink, establishedDate} = body;
    const organization = await OrganizationModel.findOne({_id: orgId});

    if(!organization)
        throw new NotFoundException("Organization not found.");
    organization.name = name ||organization.name;
    organization.address = address || organization.address;
    organization.phoneNumber = phoneNumber || organization.phoneNumber;
    organization.description = description || organization.description;
    organization.mission = mission || organization.mission;
    organization.logo = logo || organization.logo;
    organization.email = email || organization.email;
    organization.website = website || organization.website;
    organization.socialMediaLink = socialMediaLink || organization.socialMediaLink;
    organization.establishedDate = establishedDate || organization.establishedDate;
    await organization.save();
    console.log(`Update organization ${organization._id} successfully`);

    return {organization}
}

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

// NOTE: need program and event for data analysis.
// ideas for analysis:: 
// member: totals members, roles distribution, new members
// event: total events, event status, avg volunteer participation
// program: total programs, program engagement.
export const getOrganizationAnalyticsService = async(userId: string, orgId: string) => {
    const currentDate = new Date();

    const totalsProgram = await ProgramModel.countDocuments({organization: orgId});
    const totalEvent = await EventModel.countDocuments({organization:orgId});
    const totalPendingEvent = await EventModel.countDocuments({
        organization:orgId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.PENDING
    });
    const totalActiveEvent = await EventModel.countDocuments({
        organization:orgId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.ACTIVE
    });
    const totalCompleteEvent = await EventModel.countDocuments({
        organization:orgId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.COMPLETED
    });
    const totalPostponedEvent = await EventModel.countDocuments({
        organization:orgId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.POSTPONED
    });
    const analysis = {
        totalsProgram,
        totalEvent,
        totalPendingEvent,
        totalActiveEvent,
        totalCompleteEvent,
        totalPostponedEvent,
    };
    return {analysis};
}

export const deleteOrganizationByIdService = async(userId: string, orgId: string) =>{
    // NOTE: (transaction) check user is owner -> delete attendance -> delete event 
    // NOTE:  delete project-> delete member -> update user.currentOrg -> delete Org
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('[deleteOrganizationService]: Start session...');
    try {
        const organization = await OrganizationModel.findById(orgId).session(session);
        if(!organization)
            throw new NotFoundException("Organization not found.");

        // check user is owner
        if(organization.owner.toString() != userId)
            throw new BadRequestException("Yo are not authorized to delete this organization.");
        
        const events = await EventModel.find({organization: orgId}).session(session);
        
        events.every(async(event) => await AttendanceModel.deleteMany({eventId: event._id}).session(session));
        await EventModel.deleteMany({organization: orgId}).session(session);
        await ProgramModel.deleteMany({organization: orgId}).session(session);
        await MemberModel.deleteMany({orgId}).session(session);
        
        const user = await UserModel.findById(userId).session(session);
        if(!user)
             throw new NotFoundException("User not found.");
        
        if(user?.currentOrganization?.equals(orgId)){
            // find all one org that user is a part of (this org has been deleted)
            const MemberOrg = await MemberModel.findOne({userId}).session(session);
            user.currentOrganization = MemberOrg ? MemberOrg.orgId : null;
            await user.save({session});
        }

        await OrganizationModel.deleteOne({_id: orgId}).session(session);
        await session.commitTransaction();
        session.endSession();
        return {currentOrg: organization};
    } catch (error) {
        console.log("Error during session...", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
}
