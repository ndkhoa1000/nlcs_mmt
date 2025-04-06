import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { objectIdSchema } from "../validation/common.validation";
import { createAttendanceSchema, updateAttendanceSchema } from "../validation/attendance.validation";
import { 
    createAttendanceService, 
    getAttendanceByIdService, 
    getAttendancesByEventService, 
    getAttendancesByUserService, 
    updateAttendanceService, 
    deleteAttendanceService 
} from "../services/attendance.service";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roles.enums";

export const createAttendanceController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId =  String(req.user?._id);
        const eventId = objectIdSchema.parse(req.params.eventId);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const body = createAttendanceSchema.parse({...req.body});

        const { attendance } = await createAttendanceService(eventId, userId, body);
        
        return res.status(HTTPSTATUS.CREATED).json({
            message: "Attendance created successfully",
            attendance
        });
    }
);

export const getAttendanceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const attendanceId = objectIdSchema.parse(req.params.id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        
        const { role } = await getMemberRoleInWorkspaceService(String(req.user?._id), orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { attendance } = await getAttendanceByIdService(attendanceId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Attendance fetched successfully",
            attendance
        });
    }
);

export const getAttendancesByEventController = asyncHandler(
    async (req: Request, res: Response) => {
        const eventId = objectIdSchema.parse(req.params.eventId);
        const orgId = objectIdSchema.parse(req.params.orgId);
        

        const { attendances } = await getAttendancesByEventService(eventId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Attendances for event fetched successfully",
            attendances
        });
    }
);

export const getAttendancesByUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const targetUserId = req.params.userId;
        
        // If trying to view someone else's attendances, need to have proper permissions
        // for simplicity, everyone can see other's attendance on their profile
        // if (targetUserId !== String(req.user?._id)) {
            // const orgId = objectIdSchema.parse(req.params.orgId);
            // const { role } = await getMemberRoleInWorkspaceService(String(req.user?._id), orgId);
        //     roleGuard(role, [Permissions.MANAGE_EVENT]);
        // }

        const { attendances } = await getAttendancesByUserService(targetUserId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Attendances for user fetched successfully",
            attendances
        });
    }
);

export const getCurrentUserAttendancesController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const { attendances } = await getAttendancesByUserService(userId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Your attendances fetched successfully",
            attendances
        });
    }
);

export const updateAttendanceController = asyncHandler(
    async (req: Request, res: Response) => {
        const attendanceId = objectIdSchema.parse(req.params.id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const body = updateAttendanceSchema.parse(req.body);
        
        const { role } = await getMemberRoleInWorkspaceService(String(req.user?._id), orgId);
        roleGuard(role, [Permissions.MANAGE_EVENT]);

        const { attendance } = await updateAttendanceService(attendanceId, body);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Attendance updated successfully",
            attendance
        });
    }
);

export const deleteAttendanceController = asyncHandler(
    async (req: Request, res: Response) => {
        const attendanceId = objectIdSchema.parse(req.params.id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        
        const { role } = await getMemberRoleInWorkspaceService(String(req.user?._id), orgId);
        roleGuard(role, [Permissions.MANAGE_EVENT]);

        const { attendance } = await deleteAttendanceService(attendanceId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Attendance deleted successfully",
            attendance
        });
    }
);

export const deleteOwnAttendanceController = asyncHandler(
    async (req: Request, res: Response) => {
        const attendanceId = objectIdSchema.parse(req.params.id);
        const userId = String(req.user?._id);
        
        // Get the attendance to verify ownership
        const { attendance: existingAttendance } = await getAttendanceByIdService(attendanceId);
        
        // Check if the attendance belongs to the current user
        if (String(existingAttendance.userId._id) !== userId) {
            return res.status(HTTPSTATUS.FORBIDDEN).json({
                message: "You can only delete your own attendance records"
            });
        }

        const { attendance } = await deleteAttendanceService(attendanceId);
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Your attendance was successfully canceled",
            attendance
        });
    }
);