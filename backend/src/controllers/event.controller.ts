import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { objectIdSchema } from "../validation/common.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roles.enums";
import { createEventSchema, updateEventSchema } from "../validation/event.validation";
import { 
    createEventService, 
    getAllEventsInOrgService, 
    getEventByIdService, 
    updateEventByIdService, 
    deleteEventByIdService, 
    getAllEventsService
} from "../services/event.service";

export const createEventController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const body = createEventSchema.parse({ ...req.body });

        const {role} = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.CREATE_EVENT]);

        const { event } = await createEventService(userId, orgId, body);
        return res.status(HTTPSTATUS.CREATED).json({
            message: "Event created successfully.",
            event,
        });
    }
);

export const getAllEventsController = asyncHandler(
    async (req: Request, res: Response) => {
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        
        const { events, pagination } = await getAllEventsService({
            pageSize,
            pageNumber,
        });
        
        return res.status(HTTPSTATUS.OK).json({
            message: "All events fetched successfully.",
            events,
            pagination
        });
    }
);

export const getAllEventsInOrganizationController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);

        const {role} = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);
        
        const programId = req.query.programId as string;
        const status = req.query.status as string[] | undefined;
        const priority = req.query.priority as string[] | undefined;
        const assignedTo = req.query.assignedTo as string[] | undefined;
        const keyword = req.query.keyword as string;
        const registrationDeadline = req.query.registrationDeadline as string;
        const startTime = req.query.startTime as string;
        const endTime = req.query.endTime as string;
        
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const { events, pagination } = await getAllEventsInOrgService(
            orgId,
            {
                programId,
                keyword,
                status,
                priority,
                assignedTo,
                registrationDeadline,
                startTime,
                endTime
            },
            {
                pageSize,
                pageNumber
            }
        );
        
        return res.status(HTTPSTATUS.OK).json({
            message: "Events fetched successfully.",
            events,
            pagination
        });
    }
);

export const getEventByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const eventId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { event } = await getEventByIdService(orgId, eventId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Event fetched successfully.",
            event
        });
    }
);

export const updateEventByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const eventId = objectIdSchema.parse(req.params.id);
        const body = updateEventSchema.parse({ ...req.body });

        const {role} = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.EDIT_EVENT]);

        const { event } = await updateEventByIdService( orgId, eventId, body);
        return res.status(HTTPSTATUS.OK).json({
            message: "Event updated successfully.",
            event
        });
    }
);

export const deleteEventByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);
        const eventId = objectIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.DELETE_EVENT]);

        const { event } = await deleteEventByIdService(orgId, eventId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Event deleted successfully.",
            event
        });
    }
);