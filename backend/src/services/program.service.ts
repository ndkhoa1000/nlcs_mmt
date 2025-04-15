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


export const createProgramService = async(
    userId: string, 
    orgId: string,
    body :{
    name: string,
    description?: string | null,
    startDate: Date,
    endDate: Date,
    sponsors?: string[] | null,
    documents?: string[] | null,
}) => {
    const {name, description,startDate,endDate,sponsors,documents} = body;
        const program = new ProgramModel({
            name,
            description,
            organization:orgId,
            startDate,
            endDate,
            sponsors,
            documents,
            createBy: userId,
        })
        await program.save();

        return {program}
}

export const getAllProgramsService = async(
    orgId: string,
    pageSize: number,
    pageNumber: number
) =>{
    const totalCount = await ProgramModel.countDocuments({organization: orgId});
    const skip = (pageNumber -1)*pageSize;
    const programs = await ProgramModel.find({organization: orgId})
    .skip(skip)
    .limit(pageSize)
    .populate("createBy", "_id name profilePicture")
    .sort({createAt:-1})

    const totalPages =Math.ceil(totalCount/pageSize);

    return { programs, totalCount, totalPages, skip };
}

export const getProgramByIdService = async (orgId: string, programId: string) =>{
    const program = await ProgramModel.findOne({
        _id: programId,
        organization: orgId
    }).populate("createBy", "_id name profilePicture");
    if (!program)
        throw new NotFoundException("Program not found.")

    return {program};
}

export const updateProgramByIdService = async(
    orgId: string, 
    programId: string,
    body :{
        name?: string,
        description?: string,
        startDate?: Date,
        endDate?: Date,
        sponsors?: string[],
        documents?: string[],
}) => {
    const {name,description,startDate,endDate, sponsors,documents} = body;
    const program = await ProgramModel.findOne({_id:programId, organization:orgId});

    if (!program)
        throw new NotFoundException("Program not found.")
    if(name) program.name = name;
    if(description) program.description = description;
    if(startDate) program.startDate = startDate;
    if(endDate) program.endDate = endDate;
    if(sponsors) program.sponsors = sponsors;
    if(documents) program.documents = documents;

    await program.save();

    return {program};
}

export const getProgramAnalyticsService = async (orgId:string, programId:string) => {
    const currentDate = new Date();

    const totalEvent = await EventModel.countDocuments({organization:orgId, program: programId});
    const totalPendingEvent = await EventModel.countDocuments({
        organization:orgId,
        program: programId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.PENDING
    });
    const totalActiveEvent = await EventModel.countDocuments({
        organization:orgId,
        program: programId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.ACTIVE
    });
    const totalCompleteEvent = await EventModel.countDocuments({
        organization:orgId,
        program: programId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.COMPLETED
    });
    const totalPostponedEvent = await EventModel.countDocuments({
        organization:orgId,
        program: programId,
        dueDate: {$lt: currentDate},
        status: EventStatusEnum.POSTPONED
    });
    const analysis = {
        totalEvent,
        totalPendingEvent,
        totalActiveEvent,
        totalCompleteEvent,
        totalPostponedEvent,
    };
    return {analysis};
}

export const deleteProgramByIdService = async(orgId: string, programId: string) => {
    const program = await ProgramModel.findOne({organization: orgId,_id:programId});
    if(!program){
        throw new NotFoundException("Program not found or not belongs to this organization.");
    }
    
    await program.deleteOne();
    await EventModel.deleteMany({program: program._id});
    
    return {program};
}