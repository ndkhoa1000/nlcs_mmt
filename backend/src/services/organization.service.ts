
import mongoose from "mongoose";
import OrganizationModel from "../models/organization.model";
import {ConflictException, NotFoundException } from "../utils/appError";
import UserModel from "../models/user.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/roles.enums";
import MemberModel from "../models/member.model";

// TODO [x]: Create workspace -> create member(workspaceId, userId, "OWNER")
// NOTE: may not need transaction for simple service.
export const createOrganizationService = async(
    userId: string, 
    body :{
        name: string,
        address: string,
        phoneNumber: string,
        description?: string | null,
        mission?: string | null,
        email?: string | null,
        website?: string | null,
        socialMediaLink?: string[] | null,
}) => {
    const {name,address,phoneNumber,description,mission,email,website,socialMediaLink} = body;
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
                email,
                website,
                socialMediaLink,
                isVerified: true, //NOTE: only for simplify Web App, need Verify feature
                establishedDate: Date.now(),
                owner: userId
            });

            await organization.save({session});

            let member = new MemberModel({
                userId,
                orgId: organization._id,
                role: ownerRole,
            })

            await member.save({session});
            
            await session.commitTransaction();
            console.log('[createOrganizationService]: commit transaction...');
            session.endSession();
            console.log('[createOrganizationService]: session end. Finsh.');

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
