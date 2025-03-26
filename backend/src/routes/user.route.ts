import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";

const userRoutes = Router();
// crud: list - getOne - post - update - delete
userRoutes.get("/current", getCurrentUserController);
userRoutes.get("/user",);
userRoutes.get("/user/:id");
// userRoutes.post("/user");
userRoutes.put("/user/:id");
userRoutes.delete("/user/:id")

export default userRoutes;