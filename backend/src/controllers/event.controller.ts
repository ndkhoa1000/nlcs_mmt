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
        const { numberOfEvents,events } = await getAllEventsService();
        return res.status(HTTPSTATUS.OK).json({
            message: "All events fetched successfully.",
            numberOfEvents: numberOfEvents,
            events
        });
    }
);

export const getAllEventsInOrganizationController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const orgId = objectIdSchema.parse(req.params.orgId);

        const {role} = await getMemberRoleInWorkspaceService(userId, orgId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { events } = await getAllEventsInOrgService(orgId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Events fetched successfully.",
            events
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