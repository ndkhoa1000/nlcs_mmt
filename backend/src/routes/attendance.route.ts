import { Router } from "express";
import { 
    createAttendanceController,
    getAttendanceByIdController,
    getAttendancesByEventController,
    getAttendancesByUserController,
    getCurrentUserAttendancesController,
    updateAttendanceController,
    deleteAttendanceController,
    deleteOwnAttendanceController
} from "../controllers/attendance.controller";

const attendanceRoutes = Router();

attendanceRoutes.post("/organization/:orgId/event/:eventId/create", createAttendanceController);

attendanceRoutes.get("/:id/organization/:orgId", getAttendanceByIdController);

attendanceRoutes.get("/event/:eventId/organization/:orgId", getAttendancesByEventController);

attendanceRoutes.get("/user/:userId", getAttendancesByUserController);

attendanceRoutes.get("/current/user", getCurrentUserAttendancesController);

attendanceRoutes.put("/:id/organization/:orgId/update", updateAttendanceController);

attendanceRoutes.delete("/:id/organization/:orgId/delete", deleteAttendanceController);

attendanceRoutes.delete("/:id/cancel", deleteOwnAttendanceController);

export default attendanceRoutes;