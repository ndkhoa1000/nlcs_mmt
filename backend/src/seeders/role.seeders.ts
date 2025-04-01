import "dotenv/config";
import connectDatabase from "../config/database.config"
import mongoose from "mongoose";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permissions";

const seedRoles = async () => {
    console.log("Start seeding roles...")

    try {
        await connectDatabase()
        const session = await mongoose.startSession();
        session.startTransaction();
    
        console.log("delete existing roles...")
        await RoleModel.deleteMany({}).session(session);
    
        for(const roleName in RolePermissions){
            const role = roleName as keyof typeof RolePermissions;
            const permission = RolePermissions[role];
    
            const existingRole = await RoleModel.findOne({name: role}).session(session);
            if (!existingRole){
                const newRole = new RoleModel({
                    name: role,
                    permission: permission,
                });
                await newRole.save({session:session});
                console.log(`Added role ${role} with permission.`)
            } else{
                console.log(`Role ${role} already exists.`)
            }
        }
        
        await session.commitTransaction();
        console.log('Transaction committed.');
        session.endSession();
        console.log('End session.');
    } catch (error) {
     console.log('error seeding roles: \n', error);
    }
}

seedRoles().catch((error) => {
    console.log('error running seedRoles script:', error);
})
