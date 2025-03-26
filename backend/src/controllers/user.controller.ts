import { Request,Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";

export const getCurrentUserController = asyncHandler(
    async(req: Request, res: Response) => {
        // userId from req --> call service --> userData, workspaceData
        const userId = (String)(req.user?._id);
        const {user} = await getCurrentUserService(userId);

        return res.status(HTTPSTATUS.OK).json({
            message: "user fetch successfully.",
            user,
        });
    }
);