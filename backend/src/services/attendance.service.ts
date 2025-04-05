import mongoose from "mongoose";
import AttendanceModel from "../models/attendance.model";
import EventModel from "../models/event.model";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

export const createAttendanceService = async (
    eventId: string, 
    userId: string, 
    body: {
        isPresent?: boolean,
        checkInTime?: Date |null,
        checkOutTime?: Date | null,
        hoursContributed?: number,
        feedback?: string | null
    }
) => {
    // Check if event exists
    const event = await EventModel.findById(eventId);
    if (!event) {
        throw new NotFoundException("Event not found");
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new NotFoundException("User not found");
    }

    // Check if attendance already exists
    const existingAttendance = await AttendanceModel.findOne({ eventId, userId });
    if (existingAttendance) {
        throw new BadRequestException("User is already registered for this event");
    }

    // Calculate hours if check-in and check-out times are provided
    let hours = body.hoursContributed || 0;
    if (body.checkInTime && body.checkOutTime) {
        const checkIn = new Date(body.checkInTime);
        const checkOut = new Date(body.checkOutTime);
        hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    const attendance = new AttendanceModel({
        eventId,
        userId,
        isPresent: body.isPresent !== undefined ? body.isPresent : true,
        checkInTime: body.checkInTime || new Date(),
        checkOutTime: body.checkOutTime || null,
        hoursContributed: hours,
        feedback: body.feedback || null
    });

    await attendance.save();

    // Update event registration count
    event.registeredVolunteer += 1;
    await event.save();

    // Update user's total volunteer hours
    user.totalVolunteerHours += hours;
    await user.save();

    return { attendance };
};

export const getAttendanceByIdService = async (attendanceId: string) => {
    const attendance = await AttendanceModel.findById(attendanceId)
        .populate("userId", "name email profilePicture")
        .populate("eventId", "title startTime endTime");

    if (!attendance) {
        throw new NotFoundException("Attendance record not found");
    }

    return { attendance };
};

export const getAttendancesByEventService = async (eventId: string) => {
    const event = await EventModel.findById(eventId);
    if (!event) {
        throw new NotFoundException("Event not found");
    }

    const attendances = await AttendanceModel.find({ eventId })
        .populate("userId", "name email profilePicture")
        .sort({ checkInTime: -1 });

    return { attendances };
};

export const getAttendancesByUserService = async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new NotFoundException("User not found");
    }

    const attendances = await AttendanceModel.find({ userId })
        .populate("eventId", "title startTime endTime organization")
        .sort({ checkInTime: -1 });

    return { attendances };
};

export const updateAttendanceService = async (
    attendanceId: string,
    body: {
        isPresent?: boolean,
        checkInTime?: Date,
        checkOutTime?: Date,
        hoursContributed?: number,
        feedback?: string
    }
) => {
    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) {
        throw new NotFoundException("Attendance record not found");
    }

    const previousHours = attendance.hoursContributed || 0;

    let newHours = body.hoursContributed;
    if (body.checkInTime && body.checkOutTime) {
        const checkIn = new Date(body.checkInTime);
        const checkOut = new Date(body.checkOutTime);
        newHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    } else if (body.checkOutTime && attendance.checkInTime) {
        const checkIn = new Date(attendance.checkInTime);
        const checkOut = new Date(body.checkOutTime);
        newHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    // Update attendance fields
    if (body.isPresent !== undefined) attendance.isPresent = body.isPresent;
    if (body.checkInTime) attendance.checkInTime = body.checkInTime;
    if (body.checkOutTime) attendance.checkOutTime = body.checkOutTime;
    if (newHours !== undefined) attendance.hoursContributed = newHours;
    if (body.feedback !== undefined) attendance.feedback = body.feedback;

    await attendance.save();

    // Update user's total volunteer hours
    if (newHours !== undefined && newHours !== previousHours) {
        const user = await UserModel.findById(attendance.userId);
        if (user) {
            user.totalVolunteerHours = user.totalVolunteerHours - previousHours + newHours;
            await user.save();
        }
    }

    return { attendance };
};

export const deleteAttendanceService = async (attendanceId: string) => {
    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) {
        throw new NotFoundException("Attendance record not found");
    }

    const hours = attendance.hoursContributed || 0;

    await attendance.deleteOne();

    // Update event registration count
    const event = await EventModel.findById(attendance.eventId);
    if (event) {
        event.registeredVolunteer = Math.max(0, event.registeredVolunteer - 1);
        await event.save();
    }

    // Update user's total volunteer hours
    const user = await UserModel.findById(attendance.userId);
    if (user) {
        user.totalVolunteerHours = Math.max(0, user.totalVolunteerHours - hours);
        await user.save();
    }

    return { attendance };
};