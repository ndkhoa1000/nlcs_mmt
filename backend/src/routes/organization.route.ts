import { Router } from "express";
import { 
  createOrganizationController, 
  getAllOrganizationsUserIsMemberController,
  getOrganizationAnalyticsController, 
  getOrganizationByIdController, 
  getOrganizationMembersController, 
  updateOrganizationByIdController,
  deleteOrganizationByIdController 
} from "../controllers/organization.controller";
import { 
  banMemberController, 
  changeOrganizationMemberRoleController,
  joinOrganizationController, 
  leaveOrganizationController 
} from "../controllers/member.controller";

const organizationRoutes = Router();

// Core organization routes
organizationRoutes.post("/create/new", createOrganizationController);
organizationRoutes.get("/all", getAllOrganizationsUserIsMemberController);
organizationRoutes.get("/:id", getOrganizationByIdController);
organizationRoutes.get("/analytics/:id", getOrganizationAnalyticsController);
organizationRoutes.put("/update/:id", updateOrganizationByIdController);
organizationRoutes.delete("/delete/:id", deleteOrganizationByIdController);

// Member-related routes
organizationRoutes.post("/join", joinOrganizationController); // via invite code
organizationRoutes.get("/:id/member/all", getOrganizationMembersController);
organizationRoutes.put("/:id/member/role/change", changeOrganizationMemberRoleController);
organizationRoutes.delete("/:orgId/member/:id/ban", banMemberController);
organizationRoutes.delete("/:orgId/leave", leaveOrganizationController); 

//NOTE: define public routes for search and join org, search and join event later
//NOTE: all the route for org now must be authorized to access.
export default organizationRoutes;
