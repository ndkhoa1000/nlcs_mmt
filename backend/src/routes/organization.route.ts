import { Router } from "express";
import { changeOrganizationMemberRoleController, 
  createOrganizationController, 
  getAllOrganizationsUserIsMemberController,
  getOrganizationAnalyticsController, 
  getOrganizationByIdController, 
  getOrganizationMembersController, 
  updateOrganizationByIdController,
  deleteOrganizationByIdController, 
} from "../controllers/organization.controller";

const organizationRoutes = Router();

organizationRoutes.post("/create/new", createOrganizationController);
organizationRoutes.get("/all", getAllOrganizationsUserIsMemberController);
organizationRoutes.get("/:id", getOrganizationByIdController);
organizationRoutes.get("/members/:id", getOrganizationMembersController);
organizationRoutes.get("/analytics/:id", getOrganizationAnalyticsController);
organizationRoutes.put("/update/:id", updateOrganizationByIdController);
organizationRoutes.put(
  "/change/member/role/:id",
  changeOrganizationMemberRoleController
);
organizationRoutes.delete("/delete/:id", deleteOrganizationByIdController);

export default organizationRoutes
