import { Router } from "express";
import { 
    createEventController,
    getAllEventsInOrganizationController,
    getEventByIdController,
    updateEventByIdController,
    deleteEventByIdController,
    getAllEventsController
} from "../controllers/event.controller";

const eventRoutes = Router();

eventRoutes.post("/organization/:orgId/create", createEventController);
eventRoutes.get("/all",getAllEventsController);
eventRoutes.get("/organization/:orgId/all", getAllEventsInOrganizationController);
eventRoutes.get("/:id/organization/:orgId", getEventByIdController);
eventRoutes.put("/:id/organization/:orgId/update", updateEventByIdController);
eventRoutes.delete("/:id/organization/:orgId/delete", deleteEventByIdController);

export default eventRoutes;