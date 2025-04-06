import mongoose from "mongoose";
import EventModel from "../models/event.model";
import ProgramModel from "../models/program.model";
import OrganizationModel from "../models/organization.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { EventPriorityEnum, EventStatusEnum } from "../enums/event.enums";
import { eventCategoryType } from "../enums/eventCategories.enums";
import { randomUUID } from "crypto";
import MemberModel from "../models/member.model";
import AttendanceModel from "../models/attendance.model";

export const createEventService = async (
    userId: string,
    orgId: string,
    body: {
        title: string;
        description?: string | null;
        program?: string | null,
        category?: string[];
        location: string;
        status?: string;
        priority?: string;
        assignedTo?:  string[];
        cohost?: string[];
        requiredVolunteer: number;
        registrationDeadline?: Date;
        startTime?: Date | null;
        endTime?: Date | null;
        documents?: string[];
        needTraining?: boolean;
    }
) => {
    // Check if program exists and belongs to the organization
    if(body.program){
        const programIsExist = await ProgramModel.findOne({ _id: body.program, organization: orgId });
        if ( programIsExist?.organization.toString() != orgId) {
            throw new NotFoundException("Program not found or not associated with this organization");
        }
    }
        if (body.assignedTo) {
            const isAssignedUserMember = await MemberModel.exists({
              userId: body.assignedTo,
              orgId,
            });
        
            if (!isAssignedUserMember) {
              throw new Error("Assigned user is not a member of this workspace.");
            }
        }

    // Create the event
    const event = new EventModel({
        ...body,
        program: body.program,
        organization: orgId,
        status: body.status || EventStatusEnum.PENDING,
        priority: body.priority || EventPriorityEnum.MEDIUM,
        registeredVolunteer: 0,
        createBy: userId
    });

    await event.save();

    return { event };
};

export const getAllEventsService = async () => {
    const numberOfEvents = await EventModel.countDocuments({});
    const events = await EventModel.find({})
    .sort({ createAt: -1 });

    return {numberOfEvents,events}
}

export const getAllEventsInOrgService = async (orgId: string) => {
    const events = await EventModel.find({ organization: orgId})
        .populate("assignedTo", "name profilePicture")
        .populate("createBy", "name profilePicture")
        .sort({ createAt: -1 });

    return { events };
};

export const getEventByIdService = async (orgId: string, eventId: string) => {
    const event = await EventModel.findOne({ _id: eventId, organization: orgId })
        .populate("assignedTo", "name profilePicture")
        .populate("program", "name")
        .populate("createBy", "name profilePicture");

    if (!event) {
        throw new NotFoundException("Event not found");
    }

    return { event };
};

export const updateEventByIdService = async (
    orgId: string,
    eventId: string,
    body: {
        title?: string;
        description?: string | null;
        program?: string | null,
        category?: string[];
        location?: string;
        status?: string;
        priority?: string;
        assignedTo?:  string[];
        cohost?: string[];
        requiredVolunteer?: number;
    registrationDeadline?: Date;
        startTime?: Date | null;
        endTime?: Date | null;
        documents?: string[];
        needTraining?: boolean;
    }
) => {
    const {program, assignedTo, cohost} = body;
    const event = await EventModel.findOne({ _id: eventId, organization: orgId });

    if (!event) {
        throw new NotFoundException("Event not found");
    }
    if(program){
        const programIsExist = await ProgramModel.findOne({
            _id: program, 
            organization: orgId
        });
        if(!programIsExist)
            throw new NotFoundException("Program not found.");
    }
    if(cohost && cohost.length > 0){
        // Use map + Promise.all pattern instead of forEach
        await Promise.all(cohost.map(async (hostId) => {
            const hostIsExist = await OrganizationModel.findOne({_id: hostId});
            if(!hostIsExist)
                throw new NotFoundException(`Host organization with ID ${hostId} not found.`);
        }));
    }
    if(assignedTo && assignedTo.length > 0){
        await Promise.all(assignedTo.map(async (userId) => {
            const userIsExist = await MemberModel.findOne({orgId, userId});
            if(!userIsExist)
                throw new NotFoundException(`User with ID ${userId} not found or not a member of this organization.`);
        }));
    }
    // Update event fields
    Object.assign(event, body);

    await event.save();

    return { event };
};

export const deleteEventByIdService = async (orgId: string, eventId: string) => {
    const event = await EventModel.findOne({ _id: eventId, organization: orgId });

    if (!event) {
        throw new NotFoundException("Event not found");
    }

    await event.deleteOne();
    await AttendanceModel.deleteMany({ eventId });

    return { event };
};