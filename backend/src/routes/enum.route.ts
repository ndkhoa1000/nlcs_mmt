import { Router } from "express";
import { 
    getEventStatusEnumsController,
    getEventPriorityEnumsController,
    getEventCategoriesEnumsController
} from "../controllers/enum.controller";

const enumRoutes = Router();

enumRoutes.get("/event-status", getEventStatusEnumsController);
enumRoutes.get("/event-priority", getEventPriorityEnumsController);
enumRoutes.get("/event-categories", getEventCategoriesEnumsController);

export default enumRoutes;