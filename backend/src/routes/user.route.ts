import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";

const userRoutes = Router();
// get current
userRoutes.get("/current", getCurrentUserController);
//get other profile
//edit current profile
//delete user -> hidden user -> delete account -> delete all member role of other orgs..
export default userRoutes;  