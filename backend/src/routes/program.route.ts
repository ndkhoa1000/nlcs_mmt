import { Router } from "express";

import { 
    createProgramController, 
    getAllProgramsController,
    getProgramByIdController,
    getProgramAnalyticsController,
    updateProgramByIdController,
    deleteProgramByIdController,
} from "../controllers/program.controller";

const programRoutes = Router();

programRoutes.post("/organization/:orgId/create", createProgramController);
programRoutes.get("/organization/:orgId/all", getAllProgramsController);
programRoutes.get("/:id/organization/:orgId", getProgramByIdController);
programRoutes.put("/:id/organization/:orgId/update", updateProgramByIdController);
programRoutes.get("/:id/organization/:orgId/analytics", getProgramAnalyticsController);
programRoutes.delete("/:id/organization/:orgId/delete", deleteProgramByIdController);

export default programRoutes;