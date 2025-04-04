import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { EventPriorityEnum, EventStatusEnum } from "../enums/event.enums";
import { eventCategories } from "../enums/eventCategories.enums";

export const getEventStatusEnumsController = asyncHandler(
    async (_req: Request, res: Response) => {
        return res.status(HTTPSTATUS.OK).json({
            message: "Event status enums fetched successfully",
            eventStatuses: Object.values(EventStatusEnum)
        });
    }
);

export const getEventPriorityEnumsController = asyncHandler(
    async (_req: Request, res: Response) => {
        return res.status(HTTPSTATUS.OK).json({
            message: "Event priority enums fetched successfully",
            eventPriorities: Object.values(EventPriorityEnum)
        });
    }
);

export const getEventCategoriesEnumsController = asyncHandler(
    async (_req: Request, res: Response) => {
        return res.status(HTTPSTATUS.OK).json({
            message: "Event category enums fetched successfully",
            eventCategories: Object.values(eventCategories)
        });
    }
);